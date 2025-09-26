import { AssetContext } from "@/context/assetContext";
import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  BarCode01Icon,
  File02FreeIcons,
  MoneyBag02Icon,
  PinCodeIcon,
  Tag01Icon,
  Tag02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar, Profile } from "iconsax-react";
import { ReactElement, useContext } from "react";

interface DrawerProps {
  drawerIsOpen: boolean;
  setDrawerIsOpen: (isOpen: boolean) => void;
  asset: SupabaseAssetSchema | null;
}

export default function UserDrawer({
  drawerIsOpen,
  setDrawerIsOpen,
  asset,
}: DrawerProps): ReactElement {
  return (
    <Drawer
      onClose={() => setDrawerIsOpen(false)}
      isOpen={drawerIsOpen}
      backdrop="blur"
      classNames={{
        base: "rounded-none",
        header: "bg-gray-50 border-b border-gray-100",
      }}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader>Asset Details</DrawerHeader>
            <DrawerBody>
              <div>
                <div className="flex justify-between py-2 border-b border-gray-400 border-dashed">
                  <h1 className="text-2xl">{asset?.asset_name}</h1>
                  <Chip className="bg-primary text-white my-2">Assigned</Chip>
                </div>

                <div className="border-b border-gray-300 border-dashed pb-2">
                  <p className="text-lg py-2">General Information</p>
                  <div className="py-2 flex gap-[5rem]">
                    <div className="flex flex-col gap-5">
                      <div>
                        <div className="flex gap-1">
                          <HugeiconsIcon
                            icon={Tag01Icon}
                            size={18}
                            color="#9ca3af"
                          />
                          <p className="text-sm text-gray-400">
                            Asset category
                          </p>
                        </div>
                        <p className="text-gray-600">{asset?.asset_category}</p>
                      </div>
                      <div>
                        <div className="flex gap-1">
                          <HugeiconsIcon
                            icon={BarCode01Icon}
                            size={18}
                            color="#9ca3af"
                          />
                          <p className="text-sm text-gray-400">Bar Code</p>
                        </div>
                        <p className="text-gray-600">{asset?.asset_code}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-5">
                      <div>
                        <div className="flex gap-1">
                          <HugeiconsIcon
                            icon={PinCodeIcon}
                            size={18}
                            color="#9ca3af"
                          />
                          <p className="text-sm text-gray-400">Bar Code</p>
                        </div>
                        <p className="text-gray-600">{asset?.asset_sn}</p>
                      </div>
                      <div>
                        <div className="flex gap-1">
                          <Profile size={18} color="#9ca3af" />
                          <p className="text-sm text-gray-400">Assigned To</p>
                        </div>
                        <p>Elliot Sekgobela</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" pb-2">
                  <p className="text-lg py-2">Additional Information</p>
                  <div className="py-2">
                    <div className="flex gap-[5rem]">
                      <div>
                        <div className="flex gap-1">
                          <HugeiconsIcon
                            icon={MoneyBag02Icon}
                            size={18}
                            color="#9ca3af"
                          />
                          <p className="text-sm text-gray-400">
                            Purchase Price
                          </p>
                        </div>
                        <p className="text-gray-600">
                          R{asset?.purchase_price}
                        </p>
                      </div>
                      <div>
                        <div className="flex gap-1">
                          <Calendar size={18} color="#9ca3af" />
                          <p className="text-sm text-gray-400">Purchase Date</p>
                        </div>
                        <p className="text-gray-600">
                          {asset?.purchase_date
                            ? new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }).format(new Date(asset.purchase_date))
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="flex gap-1">
                        <p className="text-sm text-gray-400">Description</p>
                      </div>
                      <p>{asset?.description}</p>
                    </div>
                    <div className="py-5">
                      <p>Documents</p>
                      <div className="flex border border-gray-200 p-3 rounded-xl justify-between my-2">
                        <div className="flex gap-1">
                          <div>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              data-src="https://cdn.hugeicons.com/icons/pdf-02-bulk-rounded.svg"
                              role="img"
                              color="#000000"
                            >
                              <path
                                opacity="0.4"
                                d="M10.5874 1.25004C11.1574 1.24928 11.6619 1.2486 12.1373 1.41727C12.2353 1.45203 12.3314 1.49202 12.4251 1.53709C12.8799 1.75576 13.2362 2.11483 13.6387 2.52047L18.4215 7.32813C18.8889 7.79648 19.3036 8.21214 19.5277 8.7559C19.7518 9.29965 19.7509 9.8884 19.7499 10.5518L19.7498 11.9999H7C5.89543 11.9999 5 12.8954 5 13.9999V18.9999C5 20.1045 5.89543 20.9999 7 20.9999H18.6104C18.5229 21.1097 18.4282 21.216 18.326 21.3188C17.5457 22.1031 16.5633 22.4404 15.3965 22.5981C14.2727 22.75 12.8438 22.75 11.071 22.7499C9.29819 22.75 7.72705 22.75 6.60322 22.5981C5.43643 22.4404 4.45402 22.1031 3.67377 21.3188C2.89352 20.5345 2.55792 19.5469 2.40105 18.3741C2.24996 17.2444 2.24998 15.8081 2.25 14.0261V14.0261V9.45256V9.45254C2.24998 7.91891 2.24997 6.68233 2.36424 5.6985C2.48248 4.68054 2.73418 3.80833 3.32681 3.06948C3.54435 2.79827 3.79012 2.55122 4.05992 2.33255C4.79495 1.73684 5.66265 1.48383 6.67534 1.36498C7.6541 1.25011 9.0617 1.25002 10.5874 1.25004Z"
                                fill="#000000"
                              ></path>
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.4251 1.53771C12.3314 1.49265 12.2353 1.45265 12.1373 1.41789C11.9283 1.34373 11.7136 1.30231 11.4902 1.27924V3.27066V3.27067C11.4902 4.63252 11.4902 5.28023 11.6065 6.14542C11.7275 7.04553 11.9864 7.8034 12.5884 8.40532C13.1903 9.00724 13.9481 9.26613 14.8483 9.38715C15.7152 9.50371 16.3638 9.50449 17.7314 9.50447H19.7122C19.6816 9.24472 19.6265 8.99625 19.5277 8.75652C19.3036 8.21277 18.8889 7.79711 18.4215 7.32876L18.4215 7.32875L13.6387 2.5211C13.2362 2.11545 12.8799 1.75638 12.4251 1.53771ZM7 13.2499C6.58579 13.2499 6.25 13.5857 6.25 13.9999V18.9999C6.25 19.4142 6.58579 19.7499 7 19.7499C7.41421 19.7499 7.75 19.4142 7.75 18.9999V17.7499H8.5C9.74264 17.7499 10.75 16.7426 10.75 15.4999C10.75 14.2573 9.74264 13.2499 8.5 13.2499H7ZM8.5 16.2499H7.75V14.7499H8.5C8.91421 14.7499 9.25 15.0857 9.25 15.4999C9.25 15.9142 8.91421 16.2499 8.5 16.2499ZM12.5 13.2499C12.0858 13.2499 11.75 13.5857 11.75 13.9999V18.9999C11.75 19.4142 12.0858 19.7499 12.5 19.7499H13.7857C15.1266 19.7499 16.25 18.6877 16.25 17.3333V15.6666C16.25 14.3121 15.1266 13.2499 13.7857 13.2499H12.5ZM13.25 18.2499V14.7499H13.7857C14.3383 14.7499 14.75 15.1801 14.75 15.6666V17.3333C14.75 17.8198 14.3383 18.2499 13.7857 18.2499H13.25ZM19 13.2499C18.0335 13.2499 17.25 14.0334 17.25 14.9999V18.9999C17.25 19.4142 17.5858 19.7499 18 19.7499C18.4142 19.7499 18.75 19.4142 18.75 18.9999V17.2499H20.5C20.9142 17.2499 21.25 16.9142 21.25 16.4999C21.25 16.0857 20.9142 15.7499 20.5 15.7499H18.75V14.9999C18.75 14.8619 18.8619 14.7499 19 14.7499H21C21.4142 14.7499 21.75 14.4142 21.75 13.9999C21.75 13.5857 21.4142 13.2499 21 13.2499H19Z"
                                fill="#000000"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <p>Invoice</p>
                          </div>
                        </div>
                          <HugeiconsIcon icon={ViewIcon} size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
