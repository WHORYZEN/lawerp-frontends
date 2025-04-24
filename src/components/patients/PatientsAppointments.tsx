
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PatientsAppointments: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Simulated appointments data
  const appointments = [
    { id: "a1", date: "May 10, 2025", time: "10:30 AM", provider: "Jane Doelawyer", type: "Legal Consultation", location: "LYZ Law Firm Office", status: "upcoming" },
    { id: "a2", date: "April 25, 2025", time: "2:00 PM", provider: "Dr. Michael Johnson", type: "Physical Therapy", location: "PT Associates", status: "upcoming" },
    { id: "a3", date: "April 18, 2025", time: "3:30 PM", provider: "Dr. Michael Johnson", type: "Physical Therapy", location: "PT Associates", status: "completed" },
    { id: "a4", date: "April 15, 2025", time: "3:30 PM", provider: "Dr. Michael Johnson", type: "Physical Therapy", location: "PT Associates", status: "missed" },
    { id: "a5", date: "April 10, 2025", time: "1:00 PM", provider: "Dr. Michael Johnson", type: "Physical Therapy Evaluation", location: "PT Associates", status: "completed" },
    { id: "a6", date: "April 7, 2025", time: "11:00 AM", provider: "Dr. Sarah Smith", type: "X-Ray Review", location: "City Medical Center", status: "completed" },
    { id: "a7", date: "April 5, 2025", time: "9:00 AM", provider: "Dr. Sarah Smith", type: "Initial Evaluation", location: "City Medical Center", status: "completed" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>View your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Summary of your appointment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold mt-1">2</p>
              </div>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-1">4</p>
              </div>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold mt-1 text-red-500">1</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Next Appointment</p>
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge>Upcoming</Badge>
                    <h3 className="font-medium mt-2">Legal Consultation</h3>
                    <p className="text-sm text-muted-foreground">with Jane Doelawyer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">May 10, 2025</p>
                    <p className="text-sm">10:30 AM</p>
                    <p className="text-xs text-muted-foreground mt-1">LYZ Law Firm Office</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
          <CardDescription>All your past and upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.date}</div>
                      <div className="text-sm text-muted-foreground">{appointment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>{appointment.location}</TableCell>
                  <TableCell>
                    {appointment.status === "upcoming" && <Badge variant="outline">Upcoming</Badge>}
                    {appointment.status === "completed" && <Badge variant="secondary">Completed</Badge>}
                    {appointment.status === "missed" && <Badge variant="destructive">Missed</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsAppointments;
