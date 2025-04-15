
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarEvent, Task } from "@/types/calendar";
import CalendarSchedule from "./CalendarSchedule";
import TaskManagement from "./TaskManagement";
import { Plus } from "lucide-react";
import EventForm from "./EventForm";
import TaskForm from "./TaskForm";
import { useToast } from "@/hooks/use-toast";
import { calendarApi, tasksApi } from "@/lib/api/calendar-api";

const CalendarManagement = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Add new event
  const handleAddEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      await calendarApi.createEvent(event);
      toast({
        title: "Event created",
        description: "Your event has been successfully scheduled",
      });
      setShowEventForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      await tasksApi.createTask(task);
      toast({
        title: "Task created",
        description: "Your task has been successfully added",
      });
      setShowTaskForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => activeTab === "calendar" ? setShowEventForm(true) : setShowTaskForm(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          {activeTab === "calendar" ? "New Event" : "New Task"}
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <TabsContent value="calendar" className="mt-0">
          <CalendarSchedule onDateSelect={handleDateSelect} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          <TaskManagement />
        </TabsContent>
      </div>

      {/* Event Form Dialog */}
      {showEventForm && (
        <EventForm 
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
          onSubmit={handleAddEvent}
          isLoading={isLoading}
          initialDate={selectedDate}
        />
      )}

      {/* Task Form Dialog */}
      {showTaskForm && (
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleAddTask}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default CalendarManagement;
