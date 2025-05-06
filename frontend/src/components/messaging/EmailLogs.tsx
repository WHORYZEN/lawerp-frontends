
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Message } from '@/backend/messaging-api';
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailLogsProps {
  emails: Message[];
  isLoading: boolean;
  onSend: (recipient: string, content: string) => Promise<boolean>;
}

const EmailLogs: React.FC<EmailLogsProps> = ({ emails, isLoading, onSend }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !content) return;
    
    setSending(true);
    const emailContent = `Subject: ${subject}\n\n${content}`;
    const success = await onSend(recipient, emailContent);
    
    if (success) {
      setIsDialogOpen(false);
      setRecipient('');
      setSubject('');
      setContent('');
    }
    
    setSending(false);
  };

  // Mock recipients for demo purposes
  const recipients = [
    { id: 'client1', name: 'John Client', email: 'john@example.com' },
    { id: 'client2', name: 'Sarah Patient', email: 'sarah@example.com' },
    { id: 'client3', name: 'Michael Case', email: 'michael@example.com' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Email Logs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Compose Email
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Compose New Email</DialogTitle>
              <DialogDescription>
                Create and send an email to your client or team member
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name} ({r.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email content here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSend} 
                disabled={sending || !recipient || !subject || !content}
              >
                {sending ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No emails found. Compose a new email to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  emails.map(email => {
                    // Extract subject from content (simple implementation)
                    const contentLines = email.content.split('\n');
                    const subject = contentLines[0].startsWith('Subject:') 
                      ? contentLines[0].replace('Subject:', '').trim()
                      : 'No Subject';
                    
                    return (
                      <TableRow key={email.id}>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${email.isRead ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {email.isRead ? 'Read' : 'Unread'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {recipients.find(r => r.id === email.recipientId)?.name || email.recipientId}
                        </TableCell>
                        <TableCell>{subject}</TableCell>
                        <TableCell>{new Date(email.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default EmailLogs;
