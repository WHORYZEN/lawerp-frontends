
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserSettings } from '@/backend/settings-api';
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  settings: UserSettings | null;
  isLoading: boolean;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, isLoading, onUpdate }) => {
  const [emailNotifications, setEmailNotifications] = useState(settings?.notifications.email || false);
  const [browserNotifications, setBrowserNotifications] = useState(settings?.notifications.browser || false);
  const [smsNotifications, setSmsNotifications] = useState(settings?.notifications.sms || false);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when settings change
  React.useEffect(() => {
    if (settings) {
      setEmailNotifications(settings.notifications.email);
      setBrowserNotifications(settings.notifications.browser);
      setSmsNotifications(settings.notifications.sms);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setIsSaving(true);
    await onUpdate({
      notifications: {
        email: emailNotifications,
        browser: browserNotifications,
        sms: smsNotifications
      }
    });
    setIsSaving(false);
  };

  const handleToggleEmail = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleToggleBrowser = () => {
    setBrowserNotifications(!browserNotifications);
  };

  const handleToggleSms = () => {
    setSmsNotifications(!smsNotifications);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="email-notifications">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email for important updates.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={handleToggleEmail}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="browser-notifications">
                Browser Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser while using the application.
              </p>
            </div>
            <Switch
              id="browser-notifications"
              checked={browserNotifications}
              onCheckedChange={handleToggleBrowser}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="sms-notifications">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via SMS for critical updates.
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={handleToggleSms}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default NotificationSettings;
