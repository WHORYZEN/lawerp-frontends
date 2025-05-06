
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const PatientsCommunication: React.FC = () => {
  const communications = [
    { 
      id: "c1", 
      date: "April 20, 2025", 
      time: "10:15 AM", 
      type: "email", 
      from: "Jane Doelawyer",
      subject: "Case Update - Treatment Progress",
      preview: "Your case is progressing as expected. We have submitted your initial medical records...",
      read: true
    },
    { 
      id: "c2", 
      date: "April 18, 2025", 
      time: "2:45 PM", 
      type: "phone", 
      from: "Jane Doelawyer",
      subject: "Missed Appointment Follow-up",
      preview: "Call to discuss the missed physical therapy appointment and importance of consistent treatment.",
      duration: "8 minutes"
    },
    { 
      id: "c3", 
      date: "April 15, 2025", 
      time: "4:30 PM", 
      type: "sms", 
      from: "LYZ Law Firm",
      subject: "Appointment Reminder",
      preview: "Reminder: You have a physical therapy appointment tomorrow at 3:30 PM with Dr. Johnson at PT Associates.",
      read: true
    },
    { 
      id: "c4", 
      date: "April 12, 2025", 
      time: "11:20 AM", 
      type: "email", 
      from: "Jane Doelawyer",
      subject: "Insurance Claim Update",
      preview: "I wanted to inform you that we've received confirmation that ABC Insurance has acknowledged your claim...",
      read: true
    },
    { 
      id: "c5", 
      date: "April 10, 2025", 
      time: "9:05 AM", 
      type: "email", 
      from: "Documents Portal",
      subject: "New Document Available",
      preview: "A new document 'Letter of Protection' has been uploaded to your document center...",
      read: false
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
          <CardDescription>Record of all communications regarding your case</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map(comm => (
                <TableRow key={comm.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{comm.date}</div>
                      <div className="text-xs text-muted-foreground">{comm.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {comm.type === "email" && <Mail className="h-4 w-4 mr-1.5" />}
                      {comm.type === "sms" && <MessageSquare className="h-4 w-4 mr-1.5" />}
                      {comm.type === "phone" && <Phone className="h-4 w-4 mr-1.5" />}
                      <span className="capitalize">{comm.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{comm.from}</TableCell>
                  <TableCell>{comm.subject}</TableCell>
                  <TableCell>
                    {comm.type === "phone" ? (
                      <Badge variant="outline">{comm.duration}</Badge>
                    ) : comm.read ? (
                      <Badge variant="secondary">Read</Badge>
                    ) : (
                      <Badge>Unread</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
          <CardDescription>Select a message above to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">Case Update - Treatment Progress</h3>
                <p className="text-sm text-muted-foreground">From: Jane Doelawyer (jane.doelawyer@lyzlawfirm.com)</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                April 20, 2025, 10:15 AM
              </div>
            </div>
            <div className="prose max-w-none text-sm">
              <p>Dear Client,</p>
              <p className="mt-2">
                Your case is progressing as expected. We have submitted your initial medical records to the insurance company and are awaiting their response. You are currently in the "Active Treatment" phase, where it's important that you continue to attend all scheduled medical appointments and follow your treatment plan.
              </p>
              <p className="mt-2">
                Please be aware that you missed your physical therapy appointment on April 15. It's crucial for your case that you maintain consistent treatment. I've instructed my assistant to contact you to reschedule this appointment.
              </p>
              <p className="mt-2">
                Our next step will be to collect additional medical documentation once your current treatment phase is complete. We anticipate this will be in approximately 4-6 weeks, depending on your recovery progress.
              </p>
              <p className="mt-4">
                Best regards,<br />
                Jane Doelawyer<br />
                Personal Injury Attorney<br />
                LYZ Law Firm
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsCommunication;
