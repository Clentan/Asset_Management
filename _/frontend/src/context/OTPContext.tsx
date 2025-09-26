import { OTPInterface } from "@/interfaces/interfaces";
import { createContext, ReactElement, ReactNode, useState } from "react";

interface Children {
    children : ReactNode
};

const initialValues: OTPInterface = {
    email: "",
    setEmail: () => {}
}

export const OtpContext = createContext<OTPInterface>(initialValues);
export default function OtpProvider({ children }: Children): ReactElement {
    const [email, setEmail] = useState("");

    return (
        <OtpContext.Provider value={{ email, setEmail }}>
            { children }
        </OtpContext.Provider>
    )
}