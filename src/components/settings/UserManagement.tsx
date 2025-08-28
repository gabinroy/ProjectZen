
"use client";

import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export function UserManagement() {
  const { users, updateUserRole } = useData();
  const { user: currentUser } = useAuth();

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                value={user.role}
                onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                disabled={user.id === currentUser?.id}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
