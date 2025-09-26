import { Input } from "@heroui/input";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout05Icon,
  Notification01Icon,
  Search01FreeIcons,
  Setting06FreeIcons,
  Settings02FreeIcons,
} from "@hugeicons/core-free-icons";
import { ReactElement } from "react";
import { Profile, Setting2, Settings } from "iconsax-react";
import useAuth from "@/hooks/useAuth";

export default function Navbar(): ReactElement {

  const { signOut } = useAuth();

  return (
    <nav className="fixed top-0 right-0 left-[18dvw]  p-3 border-b bg-white z-50">
      <div className="flex justify-between">
        <div>
          <Input
            className="w-[20rem]"
            variant="bordered"
            placeholder="Search..."
            startContent={<HugeiconsIcon icon={Search01FreeIcons} />}
          />
        </div>
        <div className="flex gap-5">
          <div className="my-2">
            <HugeiconsIcon icon={Settings02FreeIcons} />
          </div>
          <div className="my-2">
            <HugeiconsIcon icon={Notification01Icon} />
          </div>
          <div className="">
            <Dropdown classNames={{
              content: "text-gray-400"
            }}
            
            >
              <DropdownTrigger>
              <Avatar src="" />

              </DropdownTrigger>
              <DropdownMenu>
              
              <DropdownSection showDivider>
              <DropdownItem key={"profile"} startContent={<Profile size={24}/>}>
                Profile
              </DropdownItem>
              <DropdownItem key={"settings"} startContent={<Setting2 size={24}/>}>
                Settings
              </DropdownItem>
              </DropdownSection>
              <DropdownItem key={"logout"} startContent={<HugeiconsIcon icon={Logout05Icon}/>} color="danger" className="bg-danger-100 text-danger-500">
              <div onClick={signOut}>
              Sign out

              </div>
              </DropdownItem>
              
              </DropdownMenu>
              
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
}
