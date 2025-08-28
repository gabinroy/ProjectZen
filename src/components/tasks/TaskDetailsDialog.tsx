"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { users } from "@/lib/data";
import { Calendar, Paperclip, User, Bot, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useState, useTransition } from "react";
import { getSummary } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

interface TaskDetailsDialogProps extends DialogProps {
  taskId: string;
}

export function TaskDetailsDialog({ taskId, ...props }: TaskDetailsDialogProps) {
  const { getTaskById, addComment } = useData();
  const { user: currentUser } = useAuth();
  const task = getTaskById(taskId);
  const [newComment, setNewComment] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!task || !currentUser) return null;

  const assignees = users.filter((u) => task.assigneeIds.includes(u.id));
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, { userId: currentUser.id, content: newComment.trim() });
      setNewComment("");
    }
  };

  const handleSummarize = () => {
    startTransition(async () => {
      const commentsText = task.comments.map(c => c.content).join('\n\n');
      if (commentsText) {
        const result = await getSummary(commentsText);
        setSummary(result);
      }
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
          <DialogDescription>
            In project <span className="font-semibold text-primary">{task.projectId}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Attachments</h3>
                        <div className="space-y-2">
                        {task.attachments.length > 0 ? task.attachments.map(att => (
                            <a key={att.id} href="#" className="flex items-center gap-2 text-sm p-2 rounded-md bg-secondary hover:bg-secondary/80">
                                <Paperclip className="h-4 w-4" />
                                <span>{att.fileName}</span>
                            </a>
                        )) : <p className="text-sm text-muted-foreground">No attachments.</p>}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">Status</span>
                            <Badge variant="secondary">{task.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">Priority</span>
                            <Badge>{task.priority}</Badge>
                        </div>
                         <div className="space-y-2">
                             <span className="text-sm font-semibold flex items-center gap-2"><Calendar className="h-4 w-4"/>Due Date</span>
                             <p className="text-sm text-muted-foreground">{format(new Date(task.dueDate), "MMM d, yyyy")}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4"/>Assignees</span>
                            <div className="flex flex-wrap gap-2">
                                {assignees.map(a => (
                                    <Avatar key={a.id} className="h-8 w-8">
                                        <AvatarImage src={a.avatarUrl} />
                                        <AvatarFallback>{a.name[0]}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />

            <div>
              <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Comments ({task.comments.length})</h3>
                  {task.comments.length > 1 && (
                      <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isPending}>
                          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4" />}
                           Summarize
                      </Button>
                  )}
              </div>
              
              {summary && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                      <Bot className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
                      <AlertTitle className="text-blue-800 dark:text-blue-300">AI Summary</AlertTitle>
                      <AlertDescription className="text-blue-700 dark:text-blue-400">
                          {summary}
                      </AlertDescription>
                  </Alert>
              )}

              <div className="space-y-4">
                {task.comments.map(comment => {
                    const commentUser = users.find(u => u.id === comment.userId);
                    return (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={commentUser?.avatarUrl} />
                                <AvatarFallback>{commentUser?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{commentUser?.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                        </div>
                    );
                })}
              </div>

              <div className="mt-4 flex gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatarUrl} />
                    <AvatarFallback>{currentUser?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea 
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>Add Comment</Button>
                </div>
              </div>

            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
