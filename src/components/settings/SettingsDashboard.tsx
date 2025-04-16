
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettings, UserProfile } from '@/backend/settings-api';
import { settingsApi } from '@/backend';
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from './ProfileSettings';
import AppearanceSettings from './AppearanceSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import { useAuth } from '@/contexts/AuthContext';

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    // Set initial value
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Using user1 as the default user ID for demo
        const userId = 'user1';
        
        // Fetch user settings
        const settings = await settingsApi.getUserSettings(userId);
        setUserSettings(settings);
        
        // Fetch user profile
        const profile = await settingsApi.getUserProfile(userId);
        setUserProfile(profile);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      const updated = await settingsApi.updateUserProfile(userProfile.userId, updatedProfile);
      if (updated) {
        setUserProfile(updated);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!userSettings) return;
    
    try {
      const updated = await settingsApi.updateUserSettings(userSettings.userId, updatedSettings);
      if (updated) {
        setUserSettings(updated);
        toast({
          title: "Success",
          description: "Settings updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-4 overflow-x-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Law EMR Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`${isSmallScreen ? 'flex flex-wrap' : 'grid grid-cols-4'} w-full max-w-md`}>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 min-w-full">
              <TabsContent value="profile" className="m-0">
                <ProfileSettings 
                  profile={userProfile} 
                  isLoading={isLoading} 
                  onUpdate={handleUpdateProfile}
                />
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <AppearanceSettings 
                  settings={userSettings} 
                  isLoading={isLoading} 
                  onUpdate={handleUpdateSettings}
                />
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <NotificationSettings 
                  settings={userSettings} 
                  isLoading={isLoading} 
                  onUpdate={handleUpdateSettings}
                />
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <SecuritySettings 
                  onLogout={logout} 
                  isLoading={isLoading}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsDashboard;
