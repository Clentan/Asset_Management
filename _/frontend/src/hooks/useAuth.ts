import { OtpContext } from "@/context/OTPContext";
import { OTPInterface } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import {useContext, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import { Authcontext } from "@/context/AuthContext";

export default function useAuth() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setEmail } = useContext(OtpContext);
    const { setIsAuthenticated } = useContext(Authcontext);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
        email,
                password
            });
            if(error) {
                console.log(error);
                return
            }
            const { status } = await axios.post("http://localhost:8080/api/otp/send", { email });
            if (status === 200) {
                setEmail(email)
                navigate("/otpverification");
                return;
            }

        } catch (error: any) {
            console.log(error.message)
        } finally {
            setIsLoading(false)
        }
    };

    const verifyOtp = async (email: string, otp: string): Promise<void | AxiosResponse> => {
        setIsLoading(true);
        try {
            const { status, data } = await axios.post("http://localhost:8080/api/otp/verify", { email, otp });
            console.log(data)
            if (status === 200) {
                setIsAuthenticated(true)
                navigate("/dashboard");
            }

        } catch (e: any) {
            console.log(e.message);
        } finally {
            setIsLoading(false)
        }
    }

    return { signIn, isLoading, verifyOtp }
}