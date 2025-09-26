import { Input } from "@heroui/input";
import { Avatar, User } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Search01FreeIcons,
  Setting06FreeIcons,
  Settings02FreeIcons,
} from "@hugeicons/core-free-icons";
import { ReactElement } from "react";

export default function Navbar(): ReactElement {
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
            <Avatar src="" />
          </div>
        </div>
      </div>
    </nav>
  );
}
