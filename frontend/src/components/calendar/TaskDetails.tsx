
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarClock, Calendar as CalendarIcon, CheckCircle, Circle, Clock, User, XCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskDetails = ({ task, isOpen, onClose, onDelete, onStatusChange }: TaskDetailsProps) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };
  
  const formatTime = (date: Date) => {
    return format(new Date(date), "h:mm a");
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="default">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-300">Pending</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Circle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <DialogTitle>{task.title}</DialogTitle>
          </div>
          {task.description && (
            <DialogDescription className="mt-2">
              {task.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {getPriorityBadge()}
            {getStatusBadge()}
          </div>
          
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Assigned To</p>
              <p className="text-sm text-muted-foreground">{task.assignedTo}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Due Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(task.dueDate))}
              </p>
            </div>
          </div>
          
          {task.reminder && (
            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Reminder</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(task.reminder))}, {formatTime(new Date(task.reminder))}
                </p>
              </div>
            </div>
          )}
          
          {task.caseId && (
            <div className="flex items-start gap-3">
              <div>
                <p className="font-medium">Related Case</p>
                <p className="text-sm text-muted-foreground">
                  Case ID: {task.caseId}
                </p>
              </div>
            </div>
          )}
          
          {task.clientId && (
            <div className="flex items-start gap-3">
              <div>
                <p className="font-medium">Related Client</p>
                <p className="text-sm text-muted-foreground">
                  Client ID: {task.clientId}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <p className="font-medium">Change Status:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  {task.status}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "pending")}>
                  <Circle className="h-4 w-4 mr-2 text-yellow-500" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "cancelled")}>
                  <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(task.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetails;
