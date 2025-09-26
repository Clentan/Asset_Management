import { ReactElement } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase05Icon,
  DeliveryBox02Icon,
  GridViewIcon,
} from "@hugeicons/core-free-icons";
import { Profile2User } from "iconsax-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import useLastActive from "@/hooks/useLastActive";

export default function SideBar(): ReactElement {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { updateLastAcivity } = useLastActive();

  return (
    <aside className="border-r w-[18dvw] fixed top-0 bottom-0 left-0 bg-white">
      <div>
        <div className="py-4">
          <h1 className="text-2xl font-semibold px-2 text-[#565656]">
            Limpopo <span className="text-[#a9b94a]">Connexion</span>
          </h1>
        </div>
        <hr />
        <div className="px-2 py-3">
          <p className="text-sm">General</p>
          <div>
            <ul className="flex flex-col gap-2 py-2">
              <li
                className={`flex gap-2 p-2 rounded cursor-pointer ${pathname === "/dashboard" ? "bg-gray-50 text-black" : "text-gray-500"}`}
                onClick={() => {
                  updateLastAcivity();
                  navigate("/dashboard");
                }}
              >
                <HugeiconsIcon icon={GridViewIcon} size={20} />
                <p className="text-sm">Dashboard</p>
              </li>
              <li
                className={`flex gap-2 p-2 rounded text-gray-500 ${pathname === "/dashboard/team-management" ? "bg-gray-50" : ""}`}
              >
                <Link to="/dashboard/team-management" className="flex gap-2">
                  <Profile2User size={20} />
                  <p className="text-sm">Team Management</p>
                </Link>
              </li>
              <li
                className={`flex gap-2 p-2 rounded text-gray-500 ${pathname === "/dashboard/inventory-management" ? "bg-gray-50" : ""}`}
              >
                <Link
                  to="/dashboard/inventory-management"
                  className="flex gap-2"
                >
                  <HugeiconsIcon icon={DeliveryBox02Icon} size={20} />
                  <p className="text-sm">Inventory Management</p>
                </Link>
              </li>
              <li
                className={`flex gap-2 p-2 rounded text-gray-500 ${pathname === "/dashboard/asset-control" ? "bg-gray-50" : ""}`}
              >
                <Link to="/dashboard/asset-control" className="flex gap-2">
                  <HugeiconsIcon icon={Briefcase05Icon} size={20} />
                  <p className="text-sm">Asset Control</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
