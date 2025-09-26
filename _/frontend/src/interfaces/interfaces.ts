import React, { Dispatch } from "react";

export interface OTPInterface {
    email: string,
    setEmail: Dispatch<React.SetStateAction<string>>,
}

export interface CurrentUser {
    userId: string,
    firstName: string,
    email: string,
    phone: string,
}

export interface AuthContextInterface {
    currentUser: any,
    setCurrentUser: Dispatch<React.SetStateAction<CurrentUser>>,
    isAuthenticated: boolean,
    setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    setIsLoading?: Dispatch<React.SetStateAction<boolean>>,
}


export interface SupabaseAssetSchema {
    asset_name: string,
    asset_type: string,
    asset_category: string,
    asset_code: string,
    asset_sn: string,
    description: string,
    asset_image_url: string,
    purchase_date?: string,
    location?: string,
    assigned_to?: string,
    condition: string,
    status: "Available" | "Assigned" | "Stolen" | "Deleted",
    created_at: string,
    updated_at?: Date
}