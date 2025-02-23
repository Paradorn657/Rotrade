import React, { useState } from 'react';


import { toast, Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const EditUserDialog = ({ user, isOpen, setIsOpen}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });

  const userId = user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("userid", user.id)
    console.log("userdata", formData)


    try {
      // เรียก API หรืออัปเดตข้อมูลใน state/database
      const respone = await fetch(`/api/edituser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId , formData }),
      });

      if(respone.ok){
      toast.success("User updated successfully");
      }else{
        toast.error("Failed to update user");
      }
      setIsOpen(false); // ปิด dialog หลังจากบันทึกสำเร็จ
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="BAN">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex space-x-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;

