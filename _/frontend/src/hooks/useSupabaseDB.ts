import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface AssetFormData {
  assetName: string;
  assetCode: string;
  serialNumber: string;
  assetType: string;
  condition: string;
  categories: string;
  description: string;
  assetImage: File | null;
}

export default function useSupabaseDB() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetFormData[] | null>(null);
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(false);

  const uploadAsset = async (Asset: AssetFormData) => {
    setIsLoading(true);
    try {
      const fullPath = `assets_photos/${Asset.assetCode}`;

      if (Asset.assetImage) {
        const { error } = await supabase.storage
          .from("assetImages")
          .upload(fullPath, Asset.assetImage, {
            contentType: "application/json",
            upsert: true,
          });
        if (error) {
          console.log(error);
          return;
        }

        const { data: url } = supabase.storage
          .from("assetImages")
          .getPublicUrl(fullPath);

        const { data: assetResults, error: assetErrors } = await supabase
          .from("assets")
          .upsert(<SupabaseAssetSchema>{
            asset_name: Asset.assetName,
            asset_code: Asset.assetCode,
            asset_sn: Asset.serialNumber,
            asset_type: Asset.assetType,
            asset_category: Asset.categories,
            asset_image_url: url.publicUrl,
            assigned_to: "",
            status: "Available",
            condition: Asset.condition,
            description: Asset.description,
          })
          .select("*");

        if (assetErrors) {
          console.log(assetErrors.message);
          return null;
        }
        if (!assetResults) {
          console.log("No asset results returned");
          return null;
        }

        return "success";
      } else {
        throw new Error("Asset image is null");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAssets = async (): Promise<void | any> => {
    const { data, error } = await supabase.from("assets").select("*");

    if(error) {
        console.log(error);
        return null
    }
    return data
  };

  return { uploadAsset, isLoading, getAllAssets, assets, isFetchingAssets };
}
