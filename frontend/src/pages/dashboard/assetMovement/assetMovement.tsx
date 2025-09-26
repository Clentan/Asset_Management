import useSupabaseDB from "@/hooks/useSupabaseDB";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
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
  useDisclosure,
} from "@heroui/react";
import { FilterIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add } from "iconsax-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { User } from "@/hooks/useUsers";
import useMovement from "@/hooks/useMovement";

interface AssetMovement {
  movement_id: string;
  asset_name: string;
  assigned_to: string;
  movement_date: string;
  reason: string;
  initiated_by: string;
}

export default function AssetMovement() {
  const { getAllAssets } = useSupabaseDB();
  const { getAllusers } = useUsers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const { newMovement } = useMovement();

  const [selectedAsset, setSelectedAsset] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [movementReason, setMovementReason] = useState("");

  const queryAssets = useQuery({
    queryKey: ["assets"],
    queryFn: getAllAssets,
  });

  const queryUsers = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getAllusers,
  });

  const movementMutation = useMutation({
    mutationKey: ["movement"],
    mutationFn: newMovement,
    onSuccess: () => {
      onClose()
    },
    onError: (e) => {
      console.log(e.message)
    }
  })

  const movements: AssetMovement[] = [
    {
      movement_id: "1",
      asset_name: "MacBook Pro",
      assigned_to: "Jane Smith",
      movement_date: "2024-02-20",
      reason: "Department transfer",
      initiated_by: "Admin User",
    },
  ];

  const handleMovementSubmit = () => {
    console.log({
      selectedAsset,
      newAssignee,
      movementReason,
    });
    onClose();
  };

  const filteredMovements = movements.filter((movement) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (movement.asset_name.toLowerCase().includes(searchLower) ||
        movement.assigned_to.toLowerCase().includes(searchLower)) &&
      (dateFilter === "" || movement.movement_date.includes(dateFilter)) &&
      (assigneeFilter === "" || movement.assigned_to === assigneeFilter)
    );
  });

  return (
    <section className="pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Asset Movement</h1>
          <p className="text-default-400">
            Track and manage asset transfers and movements across your organization
          </p>
        </div>
        <Button
          className="bg-black text-white"
          startContent={<Add size={24} />}
          onPress={onOpen}
        >
          New Movement
        </Button>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <p className="text-xl">Movement History</p>
            <Chip className="bg-black text-white">
              {filteredMovements.length < 10
                ? `0${filteredMovements.length}`
                : filteredMovements.length}
            </Chip>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search movements..."
              className="w-[20rem]"
              variant="bordered"
              startContent={<HugeiconsIcon icon={Search01Icon} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  startContent={<HugeiconsIcon icon={FilterIcon} />}
                >
                  Filter
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="date">
                  <Input
                    type="date"
                    label="Filter by Date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </DropdownItem>
                <DropdownItem key="assignee">
                  <Select
                    label="Filter by Assignee"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <SelectItem key="" value="">
                      All Assignees
                    </SelectItem>
                    {queryUsers.data?.map((user) => (
                      <SelectItem
                        key={user.email}
                        value={`${user.first_name} ${user.last_name}`}
                      >
                        {`${user.first_name} ${user.last_name}`}
                      </SelectItem>
                    ))}
                  </Select>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableColumn>Asset Name</TableColumn>
            <TableColumn>Assigned To</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Reason</TableColumn>
            <TableColumn>Initiated By</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMovements.map((movement) => (
              <TableRow key={movement.movement_id}>
                <TableCell>{movement.asset_name}</TableCell>
                <TableCell>{movement.assigned_to}</TableCell>
                <TableCell>{movement.movement_date}</TableCell>
                <TableCell>{movement.reason}</TableCell>
                <TableCell>{movement.initiated_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal size="2xl" backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h1 className="text-2xl">New Asset Movement</h1>
                <p className="text-sm text-default-400">
                  Record a new asset movement or transfer
                </p>
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-4">
                  <Select
                    label="Select Asset"
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    isRequired
                  >
                    {queryAssets.data?.map((asset) => (
                      <SelectItem key={asset.asset_id} value={asset.asset_name}>
                        {asset.asset_name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Assign To"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    isRequired
                  >
                    {queryUsers.data?.map((user) => (
                      <SelectItem
                        key={user.email}
                        value={`${user.first_name} ${user.last_name}`}
                      >
                        {`${user.first_name} ${user.last_name}`}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    label="Movement Reason"
                    placeholder="Enter reason for movement (optional)"
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="px-15 text-danger-400"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white px-[3rem]"
                  onPress={handleMovementSubmit}
                >
                  Submit Movement
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}