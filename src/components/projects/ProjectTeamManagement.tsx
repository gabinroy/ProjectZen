"use client";

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from '@/hooks/use-toast';

interface ProjectTeamManagementProps {
  projectId: string;
}

export function ProjectTeamManagement({ projectId }: ProjectTeamManagementProps) {
  const { getProjectById, users, updateProjectMembers } = useData();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const project = getProjectById(projectId);

  if (!project) return null;

  const projectMembers = users.filter(u => project.memberIds.includes(u.id));
  const nonMemberUsers = users.filter(u => !project.memberIds.includes(u.id) && u.role === 'Team Member');

  const handleAddMembers = () => {
    const newMemberIds = [...project.memberIds, ...selectedUsers];
    updateProjectMembers(projectId, newMemberIds);
    toast({
        title: "Members Added",
        description: `${selectedUsers.length} new member(s) have been added to the project.`
    });
    setSelectedUsers([]);
    setIsAddMemberDialogOpen(false);
  };
  
  const handleRemoveMember = (userId: string) => {
    if (userId === project.ownerId) {
        toast({ variant: "destructive", title: "Cannot remove manager" });
        return;
    }
    const newMemberIds = project.memberIds.filter(id => id !== userId);
    updateProjectMembers(projectId, newMemberIds);
     toast({
        title: "Member Removed",
        description: `A member has been removed from the project.`
    });
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Members
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Team Members</DialogTitle>
                </DialogHeader>
                <Command>
                    <CommandInput placeholder="Search for users..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {nonMemberUsers.map(user => (
                                <CommandItem
                                    key={user.id}
                                    onSelect={() => toggleUserSelection(user.id)}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                    {selectedUsers.includes(user.id) && <Check className="h-5 w-5 text-primary" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>Add Selected</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {projectMembers.map(member => (
          <div key={member.id} className="group relative flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{users.find(u => u.id === member.id)?.role}</span>
             {member.id !== project.ownerId && (
                 <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveMember(member.id)}
                 >
                    <X className="h-4 w-4" />
                 </Button>
             )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Dummy Check icon for now
const Check = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
  );
