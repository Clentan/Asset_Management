import { ReactElement } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase05Icon, DeliveryBox02Icon, GridViewIcon } from "@hugeicons/core-free-icons";
import { Profile2User } from "iconsax-react";

export default function SideBar(): ReactElement {
    return (
        <aside className="border-r w-[18dvw] fixed top-0 bottom-0 left-0 bg-white">
            <div>
                <div className="py-4">
                    <h1 className="text-2xl font-semibold px-2 text-[#565656]">Limpopo <span className="text-[#a9b94a]">Connexion</span></h1>
                </div>
                <hr />
                <div className="px-2 py-3">
                    <p className="text-sm">General</p>
                    <div>
                        <ul className="flex flex-col gap-2 py-2">
                            <li className="flex gap-2 bg-gray-50 p-2 rounded text-gray-500">
                                <div>
                                    <HugeiconsIcon icon={GridViewIcon} size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm">Dashboard</p>
                                </div>
                            </li>
                            <li className="flex gap-2  p-2 rounded text-gray-500">
                                <div>
                                    <Profile2User size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm">Team Management</p>
                                </div>
                            </li>
                            <li className="flex gap-2  p-2 rounded text-gray-500">
                                <div>
                                <HugeiconsIcon icon={DeliveryBox02Icon} size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm">Inventory Managment</p>
                                </div>
                            </li>
                            <li className="flex gap-2  p-2 rounded text-gray-500">
                                <div>
                                <HugeiconsIcon icon={Briefcase05Icon} size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm">Asset Control</p>
                                </div>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
}