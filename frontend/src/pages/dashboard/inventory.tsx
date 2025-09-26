import UserDrawer from "@/components/userDrawer";
import useSupabaseDB from "@/hooks/useSupabaseDB";
import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import {
  addToast,
  Button,
  Chip, DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader, Select, SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  Add01FreeIcons,
  Alert02Icon,
  Delete02Icon,
  EyeIcon,
  FilterIcon,
  Search01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useState } from "react";
import useUsers from "@/hooks/useUsers.ts";
import { parseDate, DateValue } from "@internationalized/date";

interface Asset {
  asset_id: string;
  asset_name: string;
  asset_category: string;
  asset_code: string;
  asset_sn: string;
  status: string;
  assigned: string;
}

interface GroupedAsset extends Asset {
  quantity: number;
  dispatched: number;
  available: number;
}

export default function InventoryMangement() {
  const { getAllAssets, deleteAsset } = useSupabaseDB();
  const { getAllusers } = useUsers();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const { isOpen: deletModalIsOpen, onClose: deleteModalClose, onOpen: openDeleteModal } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<SupabaseAssetSchema | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<SupabaseAssetSchema | null>(null);
  const [assetToAssign, setAssetToAssign] = useState<GroupedAsset | null>(null);
  const { isOpen: assignModalIsOpen, onClose: assignModalClose, onOpen: openAssignModal } = useDisclosure();

  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedAssetQuantity, setSelectedAssetQuantity] = useState("");
  const [expectedReturn, setExpectedReturn] = useState<DateValue | null>(null);
  const [reason, setReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const queryCLient = useQueryClient();

  const queryAssets = useQuery({
    queryKey: ["assets"],
    queryFn: getAllAssets,
  });

  const queryUsers = useQuery({
    queryKey: ["users"],
    queryFn: getAllusers
  });

  const deleteAssetMutation = useMutation({
    mutationKey: ["assetId"],
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["assets"] })
      deleteModalClose();
      addToast({
        title: "Asset Deleted",
        description: `${assetToDelete?.asset_name} has been deleted successfully.`,
        color: "success",
      })
    },
    onError: (e) => {
      addToast({
        title: `Failed to delete ${assetToDelete?.asset_name}`,
        description: `An unknown error occurred while trying to delete ${assetToDelete?.asset_name}`,
        color: "danger",
      })

      console.error(e.message)
    }
  })

  if (queryAssets.isLoading || queryAssets.isLoading) {
    return <div>Loading...</div>;
  }

  const groupedByCategory = queryAssets.data.reduce(
      (groups: Record<string, Asset[]>, item: Asset) => {
        if (!groups[item.asset_category]) {
          groups[item.asset_category] = [];
        }
        groups[item.asset_category].push(item);
        return groups;
      },
      {}
  );

  const groupedAssets = Object.entries(groupedByCategory).reduce<Record<string, GroupedAsset[]>>(
      (result, [category, items]) => {
        const uniqueItems = Array.from(
            new Set((items as Asset[]).map((item) => item.asset_name))
        ).map((name) => {
          const matching = (items as Asset[]).filter(
              (item: Asset) => item.asset_name === name
          );
          return {
            ...matching[0],
            quantity: matching.length,
            dispatched: matching.filter((item) => item.status === "In Use").length,
            available: matching.filter((item) => item.status !== "In Use").length,
          };
        });

        result[category] = uniqueItems;
        return result;
      },
      {}
  );

  const filteredAssets = queryAssets.data.filter((asset: Asset) => {
    const searchLower = searchQuery.toLowerCase();
    return (
        (asset.asset_name.toLowerCase().includes(searchLower) ||
            asset.asset_code.toLowerCase().includes(searchLower) ||
            asset.asset_sn.toLowerCase().includes(searchLower)) &&
        (categoryFilter === "" || asset.asset_category.toLowerCase() === categoryFilter.toLowerCase())
    );
  });

  return (
      <section className="pb-10">
        <Modal isOpen={deletModalIsOpen} onClose={deleteModalClose} backdrop="blur">
          <ModalContent>
            {() => (
                <>
                  <ModalHeader></ModalHeader>
                  <ModalBody>
                    <div>
                      <div className="flex justify-center">
                        <div className="w-[4rem] h-[4rem] bg-warning-100 flex justify-center items-center rounded-full mb-2">
                          <HugeiconsIcon icon={Alert02Icon} size={42} className="text-warning-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl text-center font-medium">Delete {assetToDelete?.asset_name}</p>
                        <p className="text-center text-default-400 py-1">
                          Are you sure you want to delete this asset? This action cannot be undone.
                        </p>
                      </div>
                      <div className="py-2 flex flex-col gap-2">
                        <Button className="w-full" color="danger"
                                onPress={() => {
                                  deleteAssetMutation.mutate(assetToDelete && assetToDelete?.asset_id)
                                }}
                                isLoading={deleteAssetMutation.isPending}
                        >{deleteAssetMutation.isPending ? "Deleting Asset..." : "Delete Asset"}</Button>
                        <Button className="w-full" variant="bordered" onPress={() => {
                          deleteModalClose();

                        }}>Cancel</Button>
                      </div>
                    </div>
                  </ModalBody>
                </>
            )}
          </ModalContent>
        </Modal>

        <UserDrawer drawerIsOpen={drawerIsOpen} setDrawerIsOpen={setDrawerIsOpen} asset={selectedAssets} />
        <UserDrawer drawerIsOpen={isAddDrawerOpen} setDrawerIsOpen={setIsAddDrawerOpen} asset={null} />

        <div>
          <div>
            <h1 className="text-3xl">Inventory Management</h1>
            <p className="text-default-400">
              Streamline your asset tracking and optimize inventory control with our powerful management tools
            </p>
          </div>



          <div className="mt-5">
            {Object.entries(groupedAssets).map(([category, items]) => (
                <div key={category} className="mb-8">
                  <div className="flex gap-1 mb-3">
                    <p className="text-xl">{category}</p>
                    <Chip className="bg-black text-white" variant={"shadow"}>
                      {items.length < 10 ? `0${items.length}` : items.length}
                    </Chip>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableColumn>Item name</TableColumn>
                      <TableColumn>Category</TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>In Use</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {items.map((asset: GroupedAsset) => (
                          <TableRow key={asset.asset_id}>
                            <TableCell>{asset.asset_name}</TableCell>
                            <TableCell>{asset.asset_category}</TableCell>
                            <TableCell>{asset.quantity}</TableCell>
                            <TableCell>{asset.dispatched}</TableCell>
                            <TableCell>
                              <Button
                                  variant={"shadow"}
                                  className={"bg-black text-white"}
                                  size={"sm"}
                                  onPress={() => {
                                    setAssetToAssign(asset);
                                    openAssignModal();
                                  }}
                              >
                                Assign
                              </Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between mt-5 mb-3">
              <div className="flex py-2 gap-2">
                <p className="text-xl">All Assets</p>
                <Chip className="bg-black text-white">
                  {filteredAssets.length < 10 ? `0${filteredAssets.length}` : filteredAssets.length}
                </Chip>
              </div>
              <div className="flex gap-2">
                <Input
                    placeholder="Search assets..."
                    className="w-[20rem]"
                    variant="bordered"
                    startContent={<HugeiconsIcon icon={Search01Icon} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search assets"
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" startContent={<HugeiconsIcon icon={FilterIcon} />}>
                      Filter
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={(key) => setCategoryFilter(key as string)} aria-label="Asset categories">
                    <DropdownItem key="">All Categories</DropdownItem>
                    {Object.keys(groupedByCategory).map((category) => (
                        <DropdownItem key={category}>{category}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Button
                    className="bg-black text-white"
                    startContent={<HugeiconsIcon icon={Add01FreeIcons} size={24} />}
                    onPress={() => setIsAddDrawerOpen(true)}
                >
                  Add Asset
                </Button>
              </div>
            </div>
            <Table classNames={{ tbody: "text-gray-400" }}>
              <TableHeader>
                <TableColumn>Asset Name</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Asset Code</TableColumn>
                <TableColumn>Serial Number</TableColumn>
                <TableColumn>Assigned</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset: Asset) => (
                    <TableRow key={asset.asset_id}>
                      <TableCell>{asset.asset_name}</TableCell>
                      <TableCell>{asset.asset_category}</TableCell>
                      <TableCell>{asset.asset_code}</TableCell>
                      <TableCell>{asset.asset_sn}</TableCell>
                      <TableCell>{asset.assigned ?? "No Assigned"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip content="View">
                            <Button
                                isIconOnly
                                size="sm"
                                className="bg-white text-default-400"
                                onPress={() => {
                                  setSelectedAssets(asset as unknown as SupabaseAssetSchema);
                                  setDrawerIsOpen(true);
                                }}
                            >
                              <HugeiconsIcon icon={EyeIcon} size={20} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Edit Account">
                            <Button isIconOnly size="sm" className="bg-white text-default-400">
                              <HugeiconsIcon icon={UserEdit01Icon} size={20} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete Account" color="danger">
                            <Button isIconOnly size="sm" className="bg-white" onPress={() => {
                              setAssetToDelete(asset as unknown as SupabaseAssetSchema);
                              openDeleteModal();
                            }}>
                              <HugeiconsIcon icon={Delete02Icon} size={20} color="#fb2c36" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Modal isOpen={assignModalIsOpen} onClose={assignModalClose} size={"2xl"} classNames={{
          body: "py-10 px-4"
        }}>
          <ModalContent>
            {() => (
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Assign {assetToAssign?.asset_name}</h3>
                      <p className="text-default-400">Available: {assetToAssign?.available || 0}</p>
                    </div>

                    <Select placeholder={"Select Assignees"} label={"Assignees"}  onChange={(e) => setSelectedAssignee(e.target.value)}>
                      {queryUsers.data.map((user, i) => (
                          <SelectItem key={`${user.first_name} ${user.last_name}`} textValue={`${user.first_name} ${user.last_name}`}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                      ))}
                    </Select>

                    <Select placeholder={"Select Quantity"} label={"Quantity"} onChange={e => setSelectedAssetQuantity(e.target.value)}>
                      {assetToAssign && Array.from({ length: assetToAssign.available }, (_, i) => i + 1).map((number) => (
                          <SelectItem key={number} textValue={number.toString()}>
                            {number}
                          </SelectItem>
                      ))}
                    </Select>
                    <DatePicker label={"Expected Return"} onChange={setExpectedReturn}/>
                    <Select label={"Reason"} onChange={e => setReason(e.target.value)}>
                      <SelectItem textValue={"Department Transfer"}>
                        Department Transfer
                      </SelectItem>
                      <SelectItem textValue={"Facility Usage"}>
                        Facility Usage
                      </SelectItem>
                    </Select>
                    <Textarea label={"Notes"} placeholder={"Start typing..."} onValueChange={setAdditionalNotes}/>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" variant="bordered" onPress={assignModalClose}>
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-black text-white"
                        onPress={() => console.info(selectedAssignee, selectedAssetQuantity, expectedReturn?.year, reason)}
                              variant={"shadow"}

                      >
                        Assign Asset
                      </Button>

                    </div>
                  </div>
                </ModalBody>
            )}
          </ModalContent>
        </Modal>

      </section>
  );
}
