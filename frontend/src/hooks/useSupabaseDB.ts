import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface AssetFormData {
  assetName: string;
  assetCode: string;
  serialNumber: string;
  purchaseDate: string;
  price: string,
  condition: string;
  categories: string;
  description: string;
  assetImage: File | null;
  invoice: File | null;
}

export default function useSupabaseDB() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetFormData[] | null>(null);
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(false);

  const uploadAsset = async (Asset: AssetFormData) => {
    setIsLoading(true);
    try {
      const imageFullPath = `assets_photos/${Asset.assetCode}`;
      const invoiceFullPath = `assets_invoices/${Asset.assetCode}`;
      let imageUrl = '';
      let invoiceUrl = '';

      if (Asset.assetImage) {
        const { error: imageError } = await supabase.storage
          .from("assetImages")
          .upload(imageFullPath, Asset.assetImage, {
            contentType: "image/*",
            upsert: true,
          });
        if (imageError) {
          console.log(imageError);
          return;
        }

        const { data: imageUrlData } = supabase.storage
          .from("assetImages")
          .getPublicUrl(imageFullPath);
        
        imageUrl = imageUrlData.publicUrl;
      }

      if (Asset.invoice) {
        const { error: invoiceError } = await supabase.storage
          .from("assetinvoices")
          .upload(invoiceFullPath, Asset.invoice, {
            contentType: "application/pdf",
            upsert: true,
          });
        if (invoiceError) {
          console.log(invoiceError);
          return;
        }

        const { data: invoiceUrlData } = supabase.storage
          .from("assetinvoices")
          .getPublicUrl(invoiceFullPath);
        
        invoiceUrl = invoiceUrlData.publicUrl;
      }

      const { data: assetResults, error: assetErrors } = await supabase
        .from("assets")
        .upsert(<SupabaseAssetSchema><unknown>{
          asset_name: Asset.assetName,
          asset_code: Asset.assetCode,
          asset_sn: Asset.serialNumber,
          purchase_date: Asset.purchaseDate,
          purchase_price: Asset.price,
          asset_category: Asset.categories,
          asset_image_url: imageUrl,
          invoice_url: invoiceUrl,
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAssets = async (): Promise<void | any> => {
    const { data, error } = await supabase.from("assets").select("*");

    if (error) {
      console.log(error);
      return null;
    }
    return data;
  };

  const getRequests = async (): Promise<void | any> => {
    const { data: assetRequests, error: assetRequestsError } = await supabase
      .from("asset_requests")
      .select("*");

    if (assetRequestsError) {
      console.log(assetRequestsError);
      return null;
    }

    const adminIds = assetRequests.map(
      (request: any) => request.adminId
    );
    const { data: employees, error: employeesError } = await supabase
      .from("admins")
      .select("*")
      .in("adminId", adminIds);

    if (employeesError) {
      console.log(employeesError);
      return null;
    }

    const assetIds = assetRequests.map((request: any) => request.asset_id);
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select("*")
      .in("asset_id", assetIds);

    if (assetsError) {
      console.log(assetsError);
      return null;
    }
    const requestsByEmployee = assetRequests.map((request: any) => {
      const admin = employees.find(
        (emp: any) => emp.adminId === request.adminId
      );
      const asset = assets?.find(
        (ast: any) => ast.asset_id === request.asset_id
      );
      return {
        ...request,
        admin,
        asset,
      };
    });
    
    return requestsByEmployee;
  };

  const approveAsset = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from("asset_requests")
        .update({ status: "Approved" })
        .eq("request_id", requestId);
      if (error) {
        console.log(error);
        return null;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const rejectAsset = async ({reason, requestId}: { reason: string, requestId: string }) => {
    try {
      const { error } = await supabase
        .from("asset_requests")
        .update({ status: "Rejected", rejection_reason: reason })
        .eq("request_id", requestId);

      if (error) {
        console.log(error);
        return null;
      };
    } catch (error) {
      console.log(error);
    }
  };

  const dispatchAsset = async (requestId: string) => {
    try {
      const { error: requestError } = await supabase
        .from("asset_requests")
        .update({ status: "Dispatched" })
        .eq("request_id", requestId);

      if (requestError) {
        console.log(requestError);
        return null;
      }

      // Get the asset request to update the asset status
      const { data: request, error: getRequestError } = await supabase
        .from("asset_requests")
        .select("asset_id, employee_id")
        .eq("request_id", requestId)
        .single();

      if (getRequestError || !request) {
        console.log(getRequestError);
        return null;
      }

      const { error: assetError } = await supabase
        .from("assets")
        .update({ 
          status: "In Use",
          assigned_to: request.employee_id 
        })
        .eq("asset_id", request.asset_id);

      if (assetError) {
        console.log(assetError);
        return null;
      }
      return true;
      
    } catch (error) {
      console.log(error);
    }
  };


  const deleteAsset = async (assetId: string) => {
    const { error } = await supabase
     .from("assets")
     .delete()
     .eq("asset_id", assetId);

    if(error) {
      throw new Error
    }
  };

  return {
    uploadAsset,
    isLoading,
    getAllAssets,
    assets,
    isFetchingAssets,
    getRequests,
    approveAsset,
    rejectAsset,
    dispatchAsset,
    deleteAsset
  };
}