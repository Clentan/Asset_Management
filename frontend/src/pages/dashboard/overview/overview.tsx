import RequestOverTimeChart from "@/lib/chartjs";
import { Button } from "@heroui/button";
import DropdownIcon from "@/assets/images/dropdown.svg";
import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  Image,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
  Avatar,
  Chip,
  DatePicker,
} from "@heroui/react";
import {
  CheckmarkCircle02Icon,
  DeliveryBox02Icon,
  DeliveryReturn02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add, Calendar, Timer } from "iconsax-react";
import { ReactElement, useContext, useState } from "react";
import { Authcontext } from "@/context/AuthContext";
import { FileUploader } from "react-drag-drop-files";
import useSupabaseDB from "@/hooks/useSupabaseDB";
import { SupabaseAssetSchema } from "@/interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import { categories, conditions, fileTypes } from "@/constants/constants";
import { getTodayFullDate, greetUser } from "@/utils/dateUtils";
import DashboardPending from "@/components/dashboardLoading";
import emptyStateIllustration from "@/assets/images/nothing.svg";
import RequestDetailsModal from "@/components/requestDetails";
import { FileDropper } from "zetudrop";
import { Link } from "react-router-dom";

interface AssetFormData {
  assetName: string;
  assetCode: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  condition: string;
  categories: string;
  description: string;
  assetImage: File | null;
  invoice: File | null;
}
const categoryToAssetTypes = {
  Electronics: ["Laptop", "Monitor", "Projector", "Printer"],
  Furniture: ["Office Chair", "Desk", "Cabinet"],
  Vehicle: ["Company Car", "Forklift"],
  Software: ["Antivirus License", "Cloud Storage Subscription"],
  Equipment: ["Air Conditioner", "Generator"],
};

export default function Overview(): ReactElement {
  const { currentUser } = useContext(Authcontext);
  const { uploadAsset, isLoading, getAllAssets, getRequests } = useSupabaseDB();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestModalIsOpen, setRequestModalOpen] = useState<boolean>(false);
  const [requestModalData, setModalData] = useState<any>("");

  const [nextModal, setNextModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<AssetFormData>({
    assetName: "",
    assetCode: "",
    serialNumber: "",
    purchaseDate: "",
    price: "",
    condition: "",
    categories: "",
    description: "",
    assetImage: null,
    invoice: null,
  });

  const handleFileChange = (file: File) => {
    setFormData((prevStates) => ({
      ...prevStates,
      assetImage: file,
    }));
  };

  const queryAssets = useQuery({
    queryKey: ["assets"],
    queryFn: getAllAssets,
    refetchInterval: 10000,
  });

  const queryRequests = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
    refetchInterval: 10000,
  });

  const handleSubmit = async () => {
    const res = await uploadAsset(formData);
    if (res === "success") {
      queryAssets.refetch();
      onClose();
    }
  };

  if (queryAssets.isPending || queryRequests.isPending) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <div>
          <Image
            src="https://lcx.co.za/wp-content/uploads/2024/12/thumbnail.png"
            className="h-[8rem]"
          />
          <div className="loader my-2 bg-gray-100">
            <div className="inner_loader"></div>
          </div>
        </div>
      </div>
    );
  }

  const availableAssets = queryAssets?.data
    ? queryAssets.data.filter(
        (asset: SupabaseAssetSchema) => asset.status === "Available"
      )
    : [];

  const pendingRequests = queryRequests?.data
    ? queryRequests.data.filter((asset: any) => {
        return asset.status === "Pending";
      })
    : [];

  const groupAssetsByName = () => {
    const groupedAssets: { [key: string]: SupabaseAssetSchema[] } = {};

    if (queryAssets?.data) {
      queryAssets.data.forEach((asset: SupabaseAssetSchema) => {
        const assetName = asset.asset_name.toLowerCase();
        if (!groupedAssets[assetName]) {
          groupedAssets[assetName] = [];
        }
        groupedAssets[assetName].push(asset);
      });
    }

    return groupedAssets;
  };

  const groupedAssets = groupAssetsByName();

  const calculateAverageAvailability = (assets: SupabaseAssetSchema[]) => {
    if (!assets || assets.length === 0) return 0;

    const availableCount = assets.filter(
      (asset) => asset.status === "Available"
    ).length;
    return (availableCount / assets.length) * 100;
  };

  const filteredAssetTypes = formData.categories
    ? categoryToAssetTypes[
        formData.categories as keyof typeof categoryToAssetTypes
      ] || []
    : [];

  return (
    <section className="pb-5">
      <div>
        <div>
          <p className="text-gray-400">{getTodayFullDate()}</p>
          <div className="flex justify-between">
            <p className="text-3xl">
              {greetUser()}, {currentUser?.first_name}
            </p>
            <div>
              <Button
                className="bg-black text-white px-4"
                radius="sm"
                onPress={onOpen}
                startContent={<Add size={24} color="white" />}
                variant="shadow"
              >
                New Asset
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 py-4 gap-3">
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={DeliveryBox02Icon}
                      size={24}
                      color="#3a86ff"
                      strokeWidth={2}
                    />
                  </div>
                  <p className=" text-gray-400">Total Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                  {(queryAssets.data?.length ?? 0) < 10
                    ? `0${queryAssets.data?.length ?? 0}`
                    : (queryAssets.data?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={24}
                      color="#9ef01a"
                    />
                  </div>
                  <p className=" text-gray-400">Available Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                  {(availableAssets?.length ?? 0) < 10
                    ? `0${availableAssets?.length ?? 0}`
                    : (availableAssets?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <Timer size="24" color="#ffea00" />
                  </div>
                  <p className=" text-gray-400">Pending Requests</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">
                  {(pendingRequests?.length ?? 0) < 10
                    ? `0${pendingRequests?.length ?? 0}`
                    : (pendingRequests?.length ?? 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="col-span-3 p-3" shadow="sm">
            <div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div>
                    <HugeiconsIcon
                      icon={DeliveryReturn02Icon}
                      size={24}
                      color="#9d4edd"
                    />
                  </div>
                  <p className=" text-gray-400">Returned Assets</p>
                </div>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </div>
              <div>
                <p className="text-4xl py-2">235</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="py-4">
          <div className="grid grid-cols-12 gap-5">
            <Card className="col-span-7 p-3" shadow="sm" radius="sm">
              <div className="flex justify-between">
                <p className="px-5 ">Request Over Time</p>
                <Dropdown shadow="sm">
                  <DropdownTrigger>
                    <Button
                      size="md"
                      className="px-5 "
                      variant="bordered"
                      startContent={<Calendar size="20" color="#FF8A65" />}
                    >
                      2023
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="2023">2023</DropdownItem>
                    <DropdownItem key="2022">2022</DropdownItem>
                    <DropdownItem key="2021">2021</DropdownItem>
                    <DropdownItem key="2020">2020</DropdownItem>
                    <DropdownItem key="2019">2019</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="py-5">
                <RequestOverTimeChart />
              </div>
            </Card>
            <Card className="col-span-5 h-full" shadow="sm" radius="sm">
              <p className="px-5 pt-3">Recent Asset Requests</p>
              {queryRequests.isPending && <p>Loading...</p>}
              {!queryRequests.isPending && queryRequests.data && (
                <Table
                  title="ref"
                  shadow="none"
                  selectionMode="single"
                  color="primary"
                  selectionBehavior="toggle"
                >
                  <TableHeader>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Asset</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>

                  

                  <TableBody emptyContent={<div>No requests Yet</div>}>
                    {queryAssets.data.length !== 0 &&
                      queryRequests.data
                        .slice(0, 5)
                        .map((reqs: any, i: any) => (
                          <TableRow
                            key={i}
                            onClick={() => {
                              setModalData({
                                ...reqs,
                                employee: reqs.employee,
                                asset: reqs.asset,
                              });
                              setRequestModalOpen(true);
                            }}
                            className="pb-10"
                          >
                            <TableCell className="text-gray-400 py-3">
                              <div className="flex gap-1">
                                <Avatar />
                                <div>
                                  <p className="text-sm w-[6rem] truncate">
                                    {reqs.admin?.first_name || 'N/A'}, {reqs.admin?.last_name || 'N/A'}
                                  </p>
                                  <p className="text-tiny w-[6rem] truncate">
                                    {reqs.admin?.email || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-400 py-4">
                              {reqs.asset?.asset_name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-tiny text-gray-400">
                              <Chip
                                className={`text-center rounded-full border ${
                                  reqs.status === "Approved"
                                    ? "text-success-500 bg-success-100 border-success-500"
                                    : reqs.status === "Pending"
                                      ? "text-warning-500 bg-warning-100 border-warning-500"
                                      : reqs.status === "Rejected"
                                        ? "text-danger-500 bg-danger-100 border-danger-500"
                                        : "text-gray-500 bg-gray-100 border-gray-500"
                                }`}
                              >
                                {reqs.status || 'N/A'}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>


                </Table>
              )}
            </Card>
          </div>
        </div>
        <Card className="w-full py-4" shadow="sm" radius="sm">
          <div className="flex px-4 justify-between">
            <div className="flex  gap-1">
              <HugeiconsIcon
                icon={DeliveryBox02Icon}
                size={28}
                color="#9ca3af"
                strokeWidth={2}
              />
              <p className="text-xl text-default-400">Inventory Overview</p>
            </div>
            <div>
              <Link to={"/dashboard/inventory-management"}>See more</Link>
            </div>
          </div>
          <Table className="" radius="sm" shadow="none">
            <TableHeader>
              <TableColumn>Item name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>In Use</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedAssets)
                .slice(0, 5)
                .map(([assetName, assets]) => {
                  const availableCount = assets.filter(
                    (asset) => asset.status === "Available"
                  ).length;
                  return (
                    <TableRow key={assetName}>
                      <TableCell>{assets[0].asset_name}</TableCell>
                      <TableCell>{assets[0].asset_category}</TableCell>
                      <TableCell>{assets.length}</TableCell>
                      <TableCell>{assets.length - availableCount}</TableCell>
                      <TableCell>
                        <button
                          className="bg-primary-500 text-white px-2 py-1 rounded"
                          disabled={availableCount === 0}
                        >
                          Assign
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Card>
        <Modal size="5xl" backdrop="blur" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                  <div>
                    <div className="pb-5">
                      <h1 className="text-2xl">Add new Asset</h1>
                      <p className="text-sm text-default-400">
                        {!nextModal
                          ? "Fill out the details below to add a new asset to the system."
                          : "Upload the required documents for the asset."}
                      </p>
                    </div>
                  </div>

                  {!nextModal ? (
                    // First step - Asset Details
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-4">
                        <Input
                          placeholder="Enter asset name"
                          label="Asset name"
                          className="w-[30rem]"
                          value={formData.assetName}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              assetName: e.target.value,
                            }));
                          }}
                        />
                        <Input
                          placeholder="Enter asset code"
                          label="Asset Code"
                          className="w-[30rem]"
                          value={formData.assetCode}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              assetCode: e.target.value,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex gap-4">
                        <Input
                          placeholder="Enter serial number"
                          label="Serial number"
                          className="w-[30rem]"
                          value={formData.serialNumber}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              serialNumber: e.target.value,
                            }));
                          }}
                        />
                        <Select
                          className="w-[30rem]"
                          label="Category"
                          placeholder="Select category"
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              categories: e.target.value,
                            }));
                          }}
                        >
                          {categories.map((category) => (
                            <SelectItem key={category}>{category}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="flex gap-4">
                        <DatePicker
                          className="w-[30rem]"
                          label="Purchase"
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              purchaseDate: e?.toString() || "",
                            }));
                          }}
                        />
                        <Input
                          className="w-[30rem]"
                          label="Cost price"
                          placeholder="Enter cost price"
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex gap-4">
                        <Select
                          className="w-[30rem]"
                          label="Condition"
                          placeholder="Select condition"
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              condition: e.target.value,
                            }));
                          }}
                        >
                          {conditions.map((condition) => (
                            <SelectItem key={condition}>{condition}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Textarea
                          label="Description"
                          placeholder="Start typing..."
                          value={formData.description}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    // Second step - File Uploads
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-sm mb-2">Asset Image</p>
                        <FileUploader
                          handleChange={handleFileChange}
                          name="assetImage"
                          types={fileTypes}
                        />
                        {formData.assetImage && (
                          <p className="mt-2 text-sm text-gray-500">
                            Selected image: {formData.assetImage.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm mb-2">Invoice Document</p>
                        <FileUploader
                          handleChange={(file: any) => {
                            setFormData((prev) => ({
                              ...prev,
                              invoice: file,
                            }));
                          }}
                          name="invoice"
                          types={["pdf", "doc", "docx"]}
                        />
                        {formData.invoice && (
                          <p className="mt-2 text-sm text-gray-500">
                            Selected invoice: {formData.invoice.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="px-15 text-danger-400"
                    variant="light"
                    size="lg"
                    onPress={() => {
                      if (nextModal) {
                        setNextModal(false);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {nextModal ? "Back" : "Cancel"}
                  </Button>
                  <Button
                    className="bg-black text-white px-[3rem]"
                    size="lg"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    onPress={() => {
                      if (!nextModal) {
                        setNextModal(true);
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {!nextModal
                      ? "Next"
                      : isLoading
                        ? "Uploading..."
                        : "Submit"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <RequestDetailsModal
          isOpen={requestModalIsOpen}
          data={requestModalData}
          onClose={setRequestModalOpen}
        />
      </div>
    </section>
  );
}
