
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarClock, Calendar as CalendarIcon, Clock, MapPin, Users, Trash2 } from "lucide-react";

interface EventDetailsProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const EventDetails = ({ event, isOpen, onClose, onDelete }: EventDetailsProps) => {
  const formatTime = (date: Date) => {
    return format(new Date(date), "h:mm a");
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          {event.description && (
            <DialogDescription>
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(event.start))}
                {!isSameDay(new Date(event.start), new Date(event.end)) && 
                  ` - ${formatDate(new Date(event.end))}`}
              </p>
            </div>
          </div>
          
          {!event.allDay && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                </p>
              </div>
            </div>
          )}
          
          {event.allDay && (
            <div className="flex items-center">
              <Badge>All day</Badge>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          )}
          
          {event.participants && event.participants.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Participants</p>
                <p className="text-sm text-muted-foreground">
                  {event.participants.join(", ")}
                </p>
              </div>
            </div>
          )}
          
          {event.reminderTime && (
            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Reminder</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(event.reminderTime))}, {formatTime(new Date(event.reminderTime))}
                </p>
              </div>
            </div>
          )}
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
                  This action cannot be undone. This will permanently delete the event
                  from your calendar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(event.id)}>
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

export default EventDetails;
