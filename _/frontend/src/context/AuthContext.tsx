import { AuthContextInterface } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React, { createContext, ReactElement, useEffect, useState } from "react";

const initialValue: AuthContextInterface = {
    currentUser: null,
    setCurrentUser: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    isLoading: true,
    setIsLoading: () => {}
};

interface Children {
    children: React.ReactNode
}

export const Authcontext = createContext<AuthContextInterface>(initialValue);

export default function Authprovider({ children }: Children): ReactElement {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                
                const { data, error } = await supabase.auth.getUser();

                if(error || !data) {
                    console.log(error);
                    return null
                };
                
                console.info("user retrue")
                const userData = await supabase.from("admins").select("*").eq("adminId", data.user.id).single() as { data: any[], error: any };

                if(userData.error) {
                    console.log(userData.error);
                    return null
                }

                if(!userData.data) {
                    console.log(userData.data);
                    return null
                }
                setCurrentUser(userData.data as unknown as User)
                setIsAuthenticated(true);

            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }
        getCurrentUser();
    }, []);

    return (
        <Authcontext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, setIsLoading, currentUser, setCurrentUser }}>
            { children }
        </Authcontext.Provider>
    )
}