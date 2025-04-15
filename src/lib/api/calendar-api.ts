
import { CalendarEvent, Task, TaskPriority, TaskStatus } from "@/types/calendar";
import { v4 as uuidv4 } from "uuid";

// Mock data for calendar events
let events: CalendarEvent[] = [
  {
    id: uuidv4(),
    title: "Client Meeting",
    description: "Initial consultation with new client",
    start: new Date(2025, 3, 20, 10, 0),
    end: new Date(2025, 3, 20, 11, 0),
    allDay: false,
    color: "#4f46e5",
    location: "Office",
    participants: ["John Doe", "Jane Smith"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Court Hearing",
    description: "Case #12345 preliminary hearing",
    start: new Date(2025, 3, 22, 9, 0),
    end: new Date(2025, 3, 22, 12, 0),
    allDay: false,
    color: "#ef4444",
    location: "County Courthouse",
    participants: ["John Doe", "Client A"],
    reminderTime: new Date(2025, 3, 21, 9, 0),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Document Filing Deadline",
    description: "File motion for case #54321",
    start: new Date(2025, 3, 25),
    end: new Date(2025, 3, 25),
    allDay: true,
    color: "#f97316",
    reminderTime: new Date(2025, 3, 24, 12, 0),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock data for tasks
let tasks: Task[] = [
  {
    id: uuidv4(),
    title: "Prepare client documents",
    description: "Gather and organize all necessary client documentation for case filing",
    dueDate: new Date(2025, 3, 18),
    priority: "high",
    status: "in-progress",
    assignedTo: "Jane Smith",
    reminder: new Date(2025, 3, 17, 9, 0),
    caseId: "case-123",
    clientId: "client-456",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Research precedent cases",
    description: "Find relevant precedents for the Johnson case",
    dueDate: new Date(2025, 3, 21),
    priority: "medium",
    status: "pending",
    assignedTo: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Send follow-up emails",
    description: "Contact clients who haven't responded in the last 2 weeks",
    dueDate: new Date(2025, 3, 16),
    priority: "low",
    status: "completed",
    assignedTo: "Jane Smith",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Calendar Events API
export const calendarApi = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    return Promise.resolve([...events]);
  },
  
  getEventById: async (id: string): Promise<CalendarEvent | undefined> => {
    return Promise.resolve(events.find(event => event.id === id));
  },
  
  createEvent: async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> => {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    events.push(newEvent);
    return Promise.resolve(newEvent);
  },
  
  updateEvent: async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return undefined;
    
    const updatedEvent = {
      ...events[index],
      ...eventData,
      updatedAt: new Date(),
    };
    
    events[index] = updatedEvent;
    return Promise.resolve(updatedEvent);
  },
  
  deleteEvent: async (id: string): Promise<boolean> => {
    const initialLength = events.length;
    events = events.filter(event => event.id !== id);
    return Promise.resolve(events.length < initialLength);
  },
};

// Tasks API
export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    return Promise.resolve([...tasks]);
  },
  
  getTaskById: async (id: string): Promise<Task | undefined> => {
    return Promise.resolve(tasks.find(task => task.id === id));
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    return Promise.resolve(newTask);
  },
  
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task | undefined> => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return undefined;
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date(),
    };
    
    tasks[index] = updatedTask;
    return Promise.resolve(updatedTask);
  },
  
  deleteTask: async (id: string): Promise<boolean> => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return Promise.resolve(tasks.length < initialLength);
  },
  
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.status === status));
  },
  
  getTasksByPriority: async (priority: TaskPriority): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.priority === priority));
  },
  
  getTasksByAssignee: async (assignedTo: string): Promise<Task[]> => {
    return Promise.resolve(tasks.filter(task => task.assignedTo === assignedTo));
  },
  
  getTasksByDueDate: async (date: Date): Promise<Task[]> => {
    const dateStr = date.toDateString();
    return Promise.resolve(tasks.filter(task => 
      task.dueDate.toDateString() === dateStr
    ));
  },
};
