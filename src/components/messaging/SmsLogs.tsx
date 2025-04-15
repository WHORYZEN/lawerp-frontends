
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Message } from '@/backend/messaging-api';
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SmsLogsProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (recipient: string, content: string) => Promise<boolean>;
}

const SmsLogs: React.FC<SmsLogsProps> = ({ messages, isLoading, onSend }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !content) return;
    
    setSending(true);
    const success = await onSend(recipient, content);
    
    if (success) {
      setIsDialogOpen(false);
      setRecipient('');
      setContent('');
    }
    
    setSending(false);
  };

  // Mock recipients for demo purposes
  const recipients = [
    { id: 'client1', name: 'John Client', phone: '(555) 123-4567' },
    { id: 'client2', name: 'Sarah Patient', phone: '(555) 234-5678' },
    { id: 'client3', name: 'Michael Case', phone: '(555) 345-6789' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">SMS Logs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Send New SMS</DialogTitle>
              <DialogDescription>
                Create and send an SMS message to your client
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
                      <SelectItem key={r.id} value={r.id}>{r.name} ({r.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your SMS message here..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  {content.length}/160 characters {content.length > 160 ? '(message will be split)' : ''}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSend} 
                disabled={sending || !recipient || !content}
              >
                {sending ? "Sending..." : "Send SMS"}
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
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No SMS messages found. Send a new message to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map(message => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${message.isRead ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {message.isRead ? 'Delivered' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {recipients.find(r => r.id === message.recipientId)?.name || message.recipientId}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{message.content}</TableCell>
                      <TableCell>{new Date(message.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default SmsLogs;
