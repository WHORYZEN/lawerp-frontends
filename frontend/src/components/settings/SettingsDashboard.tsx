
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettings, PrivacyPolicyDetails } from '@/backend/settings-api';
import { settingsApi } from '@/backend';
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from './ProfileSettings';
import AppearanceSettings from './AppearanceSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import PrivacySettings from './PrivacySettings';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'react-router-dom';

const SettingsDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [privacyPolicyDetails, setPrivacyPolicyDetails] = useState<PrivacyPolicyDetails | null>(null);
  const { toast } = useToast();
  const { logout } = useAuth();
  const { userProfile, isLoading: isProfileLoading, updateUserProfile } = useUser();

  useEffect(() => {
    // Update active tab when URL changes
    const newTab = tabFromUrl || 'profile';
    setActiveTab(newTab);
  }, [tabFromUrl]);

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
    const fetchUserSettings = async () => {
      setIsSettingsLoading(true);
      try {
        // Using user1 as the default user ID for demo
        const userId = 'user1';
        
        // Fetch user settings
        const settings = await settingsApi.getUserSettings(userId);
        setUserSettings(settings);
        
        // Fetch privacy policy details
        const privacyPolicy = await settingsApi.getPrivacyPolicyDetails();
        setPrivacyPolicyDetails(privacyPolicy);
        
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast({
          title: "Error",
          description: "Failed to load user settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchUserSettings();
  }, [toast]);

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
          <CardTitle>LAW ERP 500 Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`${isSmallScreen ? 'flex flex-wrap' : 'grid grid-cols-5'} w-full max-w-4xl`}>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 min-w-full">
              <TabsContent value="profile" className="m-0">
                <ProfileSettings 
                  profile={userProfile} 
                  isLoading={isProfileLoading} 
                  onUpdate={updateUserProfile}
                />
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <AppearanceSettings 
                  settings={userSettings} 
                  isLoading={isSettingsLoading} 
                  onUpdate={handleUpdateSettings}
                />
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <NotificationSettings 
                  settings={userSettings} 
                  isLoading={isSettingsLoading} 
                  onUpdate={handleUpdateSettings}
                />
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <SecuritySettings 
                  onLogout={logout} 
                  isLoading={isSettingsLoading}
                />
              </TabsContent>
              
              <TabsContent value="privacy" className="m-0">
                <PrivacySettings 
                  isLoading={isSettingsLoading}
                  privacyPolicyDetails={privacyPolicyDetails}
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
