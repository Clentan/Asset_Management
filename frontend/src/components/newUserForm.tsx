import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Button,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { DefinedQueryObserverResult, useMutation } from '@tanstack/react-query';
import useUsers from '@/hooks/useUsers';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: "super-admin" | "admin" | "employee";
}

const roles = ['super-admin', 'admin', 'employee'];
const { addUser } = useUsers();

const AddUserModal = ({ isOpen, onClose, refetch }: { isOpen: boolean; onClose: () => void, refetch:  DefinedQueryObserverResult }) => {
  const [formData, setFormData] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'employee',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const mutateNewUser = useMutation({
    mutationKey: ["new_user"],
    mutationFn: (data: User) => addUser(data),
    onSuccess: () => {
      refetch.refetch()
    }
  });

  const handleSubmit = async () => {
    mutateNewUser.mutate(formData);
    onClose();
  };

  return (
    <Modal size="5xl" backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h1 className="text-2xl">Add New User</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <Input
                placeholder="Enter first name"
                label="First Name"
                name="first_name"
                className="w-[30rem]"
                value={formData.first_name}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Enter last name"
                label="Last Name"
                name="last_name"
                className="w-[30rem]"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Enter email"
                label="Email"
                name="email"
                className="w-[30rem]"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Enter phone number"
                label="Phone"
                name="phone"
                className="w-[30rem]"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
              <Select
                className="w-[30rem]"
                label="Role"
                name="role"
                placeholder="Select role"
                onChange={handleSelectChange}
              >
                {roles.map((role) => (
                  <SelectItem key={role} textValue={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
              <Input
                placeholder="Enter password"
                label="Password"
                name="password"
                type="password"
                className="w-[30rem]"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="px-15 text-danger-400" variant="light" size="lg" onPress={onClose}>
            Cancel
          </Button>
          <Button className="bg-black text-white px-[3rem]" size="lg" onPress={handleSubmit} isLoading={mutateNewUser.isPending} disabled={mutateNewUser.isPending}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;