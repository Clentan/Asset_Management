import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";



interface Asset {
  asset_code: number;
  asset_name: string;
  asset_id: number;
  name: string;
  description: string;
  status: string;
  // Add other fields as per your schema
}

interface AssetRequest {
    request_id: number;
    employee_id: string;
    asset_id: number;
    request_date: string;
    purpose: string;
    destination: string;
    expected_return_date: string;
    status: string;
    approver_id?: number | null;
    approval_date?: string | null;
    rejection_reason?: string | null;
    return_date?: string | null;
    return_condition?: string | null;
}

interface AssetContextType {
    assets: Asset[];
    assetRequests: AssetRequest[];
    fetchAssets: () => Promise<void>;
    fetchAssetRequests: () => Promise<void>;
    requestAsset: (asset_id: number, purpose: string, expected_return_date: string) => Promise<void>;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);

  // Fetch assets from Supabase
  const fetchAssets = async () => {
    const { data, error } = await supabase.from("assets").select("*");

    if (error) {
      console.error("Error fetching assets:", error);
      return;
    }

    setAssets(data || []);
  };


 // Fetch asset requests from Supabase
 const fetchAssetRequests = async () => {
    const { data, error } = await supabase.from("asset_requests").select("*");

    if (error) {
      console.error("Error fetching asset requests:", error);
      return;
    }

    setAssetRequests(data || []);
  };

  // Request an asset
  const requestAsset = async (   
    asset_id: number, 
    purpose: string,     
    expected_return_date: string ) => {

    const { error } = await supabase.from("asset_requests").insert([
      {
        employee_id: "S123456",
        asset_id,
        purpose,
        destination: "HQ",
        expected_return_date,
        status: "Pending",
      },
    ]);

    if (error) {
      console.error("Error requesting asset:", error);
      return;
    }

    // Refresh asset requests after a new one is added
    fetchAssetRequests();
  };

  useEffect(() => {
    fetchAssets();
    fetchAssetRequests();
  }, []);

  return (
    <AssetContext.Provider value={{ assets, assetRequests, fetchAssets, fetchAssetRequests, requestAsset }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};
