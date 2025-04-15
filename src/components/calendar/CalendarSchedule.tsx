
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays, addMonths, subMonths, getDay, isSameMonth, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/types/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { calendarApi } from "@/lib/api/calendar-api";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetails from "./EventDetails";

interface CalendarScheduleProps {
  onDateSelect: (date: Date) => void;
}

const CalendarSchedule = ({ onDateSelect }: CalendarScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await calendarApi.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      toast({
        title: "Error fetching events",
        description: "Could not load calendar events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate days to display based on view mode
  const daysToDisplay = () => {
    if (viewMode === "month") {
      return [];  // Not needed for the month view
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else {
      // Day view
      return [currentDate];
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  // Get a color class based on the event color
  const getColorClass = (color?: string) => {
    switch (color) {
      case "#ef4444":
        return "bg-red-500 text-white";
      case "#f97316":
        return "bg-orange-500 text-white";
      case "#4f46e5":
        return "bg-indigo-500 text-white";
      case "#10b981":
        return "bg-emerald-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await calendarApi.deleteEvent(id);
      setSelectedEvent(null);
      fetchEvents();
      toast({
        title: "Event deleted",
        description: "The event has been successfully removed from your calendar",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-medium">
              {viewMode === "month" 
                ? format(currentDate, "MMMM yyyy")
                : viewMode === "week"
                ? `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`
                : format(currentDate, "EEEE, MMMM d, yyyy")
              }
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsList>
            <TabsTrigger 
              value="month" 
              onClick={() => setViewMode("month")}
              className={viewMode === "month" ? "bg-primary text-primary-foreground" : ""}
            >
              Month
            </TabsTrigger>
            <TabsTrigger 
              value="week" 
              onClick={() => setViewMode("week")}
              className={viewMode === "week" ? "bg-primary text-primary-foreground" : ""}
            >
              Week
            </TabsTrigger>
            <TabsTrigger 
              value="day" 
              onClick={() => setViewMode("day")}
              className={viewMode === "day" ? "bg-primary text-primary-foreground" : ""}
            >
              Day
            </TabsTrigger>
          </TabsList>
        </div>

        {viewMode === "month" ? (
          <div className="mt-4">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && onDateSelect(date)}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="rounded-md border p-3"
              modifiers={{
                event: (date) => events.some(event => 
                  isSameDay(new Date(event.start), date)
                )
              }}
              modifiersClassNames={{
                event: "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-500"
              }}
              components={{
                Caption: ({ displayMonth }) => (
                  <div className="flex justify-center py-2 relative">
                    <span className="text-sm font-medium">
                      {format(displayMonth, "MMMM yyyy")}
                    </span>
                  </div>
                ),
              }}
            />
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Events for {format(currentDate, "MMMM d, yyyy")}</h3>
              {isLoading ? (
                <p>Loading events...</p>
              ) : (
                <div className="space-y-2">
                  {getEventsForDay(currentDate).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events scheduled for this day</p>
                  ) : (
                    getEventsForDay(currentDate).map((event) => (
                      <Card 
                        key={event.id} 
                        className={`p-3 cursor-pointer ${getColorClass(event.color)}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            {!event.allDay && (
                              <div className="flex items-center text-sm mt-1 opacity-90">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center text-sm mt-1 opacity-90">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          {event.allDay && <Badge variant="outline" className="bg-white/20 text-white">All day</Badge>}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {daysToDisplay().map((day) => (
              <Card key={day.toISOString()} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-medium ${isSameMonth(day, currentDate) ? "" : "text-muted-foreground"}`}>
                    {format(day, "EEEE, MMMM d")}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {getEventsForDay(day).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No events scheduled</p>
                  ) : (
                    getEventsForDay(day).map((event) => (
                      <Card 
                        key={event.id} 
                        className={`p-3 cursor-pointer ${getColorClass(event.color)}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            {!event.allDay && (
                              <div className="flex items-center text-sm mt-1 opacity-90">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center text-sm mt-1 opacity-90">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          {event.allDay && <Badge variant="outline" className="bg-white/20 text-white">All day</Badge>}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default CalendarSchedule;
