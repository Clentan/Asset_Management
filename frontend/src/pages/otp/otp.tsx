import React, {ReactElement, useContext, useState} from "react";
import Logo from "@/assets/images/logo.png";
import Illustration from "@/assets/images/emailsent.svg";
import { Image } from "@heroui/image";
import { InputOtp } from "@heroui/input-otp"
import { Button } from "@heroui/button";
import useAuth from "@/hooks/useAuth";
import {OtpContext} from "@/context/OTPContext.tsx";

export default function OneTimeVerification(): ReactElement {
    const { isLoading, verifyOtp } = useAuth();
    const [otp, setOtp] = useState("");
    const { email } = useContext(OtpContext);


    return (
        <main>
            <section className="">
                <div className="grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-6 flex flex-row justify-center">
                        <div>
                            <div className="px-3 lg:w-[34dvw] py-[10dvh]">
                                <div>
                                    <div className="flex flex-row justify-center ">
                                        <Image
                                            src={Logo}
                                            className="h-[5rem] lg:h-[8rem] object-cover"
                                        />
                                    </div>
                                    <div className="mt-10">
                                        <h1 className="text-2xl font-medium">
                                            Secure Your Access with OTP Verification!
                                        </h1>
                                        <p className="text-default-400">
                                        We've sent a one-time password to your email. Enter it below to continue.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 py-5">
                                    <div className="flex ">
                                    <InputOtp length={6} size="lg" value={otp} onValueChange={(e) => setOtp(e)}/>
                                    </div>
                                    <div>
                                        <Button
                                            className="w-full py-[28px] bg-black text-white"
                                            isLoading={isLoading}
                                            isDisabled={isLoading}
                                            onPress={() => verifyOtp(email, otp)}
                                        >
                                            Continue
                                        </Button>
                                        <div className="flex flex-row justify-center py-5 gap-1">
                                            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                                            <div className="h-3 w-10 bg-black rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block col-span-6 bg-[#F5F7E3] h-screen">
                        <div className="flex justify-center">
                            <div className="py-20">
                                <h1 className="text-center text-4xl font-semibold">
                                Quick & Secure Authentication!
                                </h1>
                                <div className="flex flex-row justify-center py-10">
                                    <Image
                                        src={Illustration}
                                        className="h-[50dvh] object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
