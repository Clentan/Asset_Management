import { supabase } from "@/lib/supabase"
import axios, { AxiosResponse } from "axios";

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    role: "super-admin" | "admin" | "employee";
  }

export default function useUsers() {

    const addUser = async (data: User): Promise<AxiosResponse> => {
        return await axios.post("http://localhost:8080/api/users/create", data);
    }

    const getAllusers = async (): Promise<any> => {
        try {
            const { data } = await supabase.from("admins").select("*");
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async (userId: string): Promise<any> => {
         await axios.delete("http://localhost:8080/api/users/delete/" + userId);
    }

    return { getAllusers, addUser, deleteUser }
}