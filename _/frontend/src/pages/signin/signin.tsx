import React, { ReactElement, useState } from "react";
import Logo from "../../assets/images/logo.png";
import Illustration from "@/assets/images/signin_illustration.svg";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import useAuth from "@/hooks/useAuth";

export default function Signin(): ReactElement {
    const { isLoading, signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

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
                                            Let’s Get You Back to Managing!
                                        </h1>
                                        <p className="text-default-400">
                                            Sign in to access your dashboard and manage assets
                                            efficiently.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 py-5">
                                    <div>
                                        <Input
                                            label="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <p className="text-end px-2 py-1">Forgot password</p>
                                    </div>
                                    <div>
                                        <Button
                                            className="w-full py-[28px] bg-black text-white"
                                            isLoading={isLoading}
                                            isDisabled={isLoading}
                                            onPress={() => signIn(email, password)}
                                        >
                                            Continue
                                        </Button>
                                        <div className="flex flex-row justify-center py-5 gap-1">
                                            <div className="h-3 w-10 bg-black rounded-full"></div>
                                            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block col-span-6 bg-[#F5F7E3] h-full">
                        <div className="flex justify-center">
                            <div className="py-20">
                                <h1 className="text-center text-4xl font-semibold">
                                    Effortless Asset Management Awaits!
                                </h1>
                                <div className="flex flex-row justify-center">
                                    <Image
                                        src={Illustration}
                                        className="h-[70dvh] object-cover"
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
