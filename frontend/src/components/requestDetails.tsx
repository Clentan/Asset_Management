import useSupabaseDB from "@/hooks/useSupabaseDB";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { TickCircle, CloseCircle, Timer, Send2 } from "iconsax-react";
import { ReactElement, useState } from "react";
interface RequestDetailsModalProps {
  data: {
    admin: {
      first_name: string;
      last_name: string;
      email: string;
    };
    asset: {
      asset_name: string;
      asset_category: string;
      asset_code: string;
      description: string;
    };
    status: string;
    created_at: string;
    request_id: string;
    rejection_reason?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}
export default function RequestDetailsModal({
  data,
  isOpen,
  onClose,
}: RequestDetailsModalProps): ReactElement {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const { approveAsset, rejectAsset, dispatchAsset } = useSupabaseDB();
  const handleAction = (key: string) => {
    if (key === "reject") {
      setIsRejecting(true);
    } else if (key === "confirm-rejection") {
      if (rejectionComment.trim()) {
        mutateRejection.mutate({
          reason: rejectionComment,
          requestId: data.request_id,
        });
      }
    } else if (key === "approve") {
      mutateApprove.mutate(data.request_id);
    } else if (key === "dispatch") {
      mutateDispatch.mutate(data.request_id);
    }
  };
  const mutateApprove = useMutation({
    mutationKey: ["approve"],
    mutationFn: (assetId: string) => approveAsset(assetId),
    onSuccess: () => {
      onClose();
    },
  });
  const mutateDispatch = useMutation({
    mutationKey: ["dispatch"],
    mutationFn: (assetId: string) => dispatchAsset(assetId),
    onSuccess: () => {
      onClose();
    },
  });

  const mutateRejection = useMutation({
    mutationKey: ["reject"],
    mutationFn: ({
      reason,
      requestId,
    }: {
      reason: string;
      requestId: string;
    }) => rejectAsset({ reason, requestId }),
    onSuccess: () => onClose(),
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsRejecting(false);
        onClose();
      }}
      backdrop="blur"
      size="xl"
      classNames={{
        body: "px-0",
        header: "py-0 bg-gray-50 py-4 font-medium",
        footer: "py-4 px-1 border-t",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>
              <p>Request Details</p>
            </ModalHeader>
            <ModalBody>
              <div>
                <div className="flex justify-between px-5 py-2">
                  <div className="flex gap-1">
                    <Avatar />
                    <div>
                      <p className="text-sm"> {data.admin?.first_name || 'N/A'}, {data.admin?.last_name || 'N/A'}</p>
                      <p className="text-tiny text-gray-400">
                        {data.admin.email}
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Chip
                      size="sm"
                      color={
                        data.status === "Pending"
                          ? "warning"
                          : data.status === "Approved"
                          ? "success"
                          : "danger"
                      }
                      className="px-2"
                      variant="shadow"
                      startContent={<Timer size={15} color="black" />}
                    >
                      {data.status}
                    </Chip>
                  </div>
                </div>
                <div className="border-t my-2"></div>
                <div className="px-5 flex gap-[10rem]">
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-gray-400 text-tiny">Item</p>
                      <p className="text-gray-400 text-small">
                        {data.asset.asset_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-tiny">Category</p>
                      <p className="text-gray-400 text-small">
                        {data.asset.asset_category}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-gray-400 text-tiny">Asset code</p>
                      <p className="text-gray-400 text-small">
                        {data.asset.asset_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-tiny">Request Date</p>
                      <p className="text-gray-400 text-small">
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          hour12: false,
                        }).format(new Date(data.created_at))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 mt-5">
                  <p className="text-gray-400 text-tiny">Description</p>
                  <p className="text-gray-400 text-small">
                    {data.asset.description}
                  </p>
                </div>
              </div>

              {data.status === "Rejected" && (
                <>
                  <div className="border-t my-2"></div>
                  <div className="mb-2 px-5">
                    <Textarea
                      variant="bordered"
                      label="Reason for Rejection"
                      placeholder={data.rejection_reason}
                      disabled
                    />
                  </div>
                </>
              )}

              {isRejecting && (
                <>
                  <Divider />
                  <div className="flex flex-col gap-5 px-5">
                    <Textarea
                      label="Reason for Rejection"
                      placeholder="Enter your reason for rejecting this request"
                      value={rejectionComment}
                      onChange={(e) => setRejectionComment(e.target.value)}
                    />
                  </div>
                  <div className="flex px-5">
                    <Button
                      className="bg-black text-white px-14"
                      onPress={() => {
                        mutateRejection.mutate({
                          reason: rejectionComment,
                          requestId: data.request_id,
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="flex justify-end gap-4 px-5">
                <Button className="px-10 bg-white text-danger-500" onPress={onCloseModal}>
                  Close
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-black text-white px-14">Action</Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    onAction={(e) => handleAction(e as string)}
                    disabledKeys={
                      data.status === "Approved"
                        ? ["approve"]
                        : data.status === "Rejected"
                        ? ["reject"]
                        : undefined
                    }
                  >
                    {data.status !== "Approved" && data.status !== "Rejected" ? (
                      <DropdownItem
                        key="approve"
                        startContent={
                          <TickCircle size={20} color="green" variant="Bulk" />
                        }
                        className="text-sm"
                      >
                        Approve
                      </DropdownItem>
                    ) : null}

                    {data.status === "Approved" ? (
                      <DropdownItem
                        key="dispatch"
                        startContent={
                          <Send2 size={20} color="blue" variant="Bulk" />
                        }
                        className="text-sm"
                      >
                        Dispatch
                      </DropdownItem>
                    ) : null}

                    {data.status !== "Rejected" && data.status !== "Approved" ? (
                      <DropdownItem
                        key="reject"
                        startContent={
                          <CloseCircle size={20} color="red" variant="Bulk" />
                        }
                        className="text-sm"
                      >
                        Reject
                      </DropdownItem>
                    ) : null}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}