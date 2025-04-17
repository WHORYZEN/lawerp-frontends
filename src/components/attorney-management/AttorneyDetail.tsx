
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  MapPin, 
  Phone, 
  Scale, 
  User, 
  FileText,
  Edit
} from 'lucide-react';
import { Attorney } from './AttorneyList';
import AttorneyForm from './AttorneyForm';
import { useToast } from "@/hooks/use-toast";

interface AttorneyDetailProps {
  attorneyId: string;
  onBack: () => void;
}

const AttorneyDetail = ({ attorneyId, onBack }: AttorneyDetailProps) => {
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock API request
    const fetchAttorney = async () => {
      setIsLoading(true);
      
      // Simulated API response
      setTimeout(() => {
        // This would be an API call in a real application
        // For now, using mock data
        const mockAttorney: Attorney = {
          id: attorneyId,
          firstName: 'Rachel',
          lastName: 'Green',
          email: 'rgreen@lyzlaw.com',
          phone: '555-123-4567',
          role: 'Partner',
          barNumber: 'BAR123456',
          specialization: 'Corporate Law',
          bio: 'Senior partner with 15 years of corporate law experience. Specializes in mergers and acquisitions, corporate restructuring, and securities regulations. Previously worked at Johnson & Smith Law firm where she represented Fortune 500 companies in complex business transactions. Rachel has been recognized in the "Best Lawyers in America" publication for the past 5 years.',
          profileImage: '',
          officeLocation: 'Main Office, Floor 12',
          isActive: true,
          createdAt: '2022-01-15T00:00:00Z',
          updatedAt: '2023-03-20T00:00:00Z'
        };
        
        setAttorney(mockAttorney);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchAttorney();
  }, [attorneyId]);

  const handleUpdateAttorney = (updatedData: Omit<Attorney, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (attorney) {
      const updatedAttorney: Attorney = {
        ...attorney,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      setAttorney(updatedAttorney);
      setIsEditing(false);
      
      toast({
        title: "Attorney Updated",
        description: `${updatedAttorney.firstName} ${updatedAttorney.lastName}'s profile has been updated.`
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-20">
            <p>Loading attorney details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attorney) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-20">
            <p className="text-muted-foreground mb-4">Attorney not found</p>
            <Button onClick={onBack}>Back to List</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Button>
            <h3 className="text-xl font-medium">Edit Attorney</h3>
          </div>
          
          <AttorneyForm 
            attorney={attorney} 
            onSubmit={handleUpdateAttorney} 
            onCancel={() => setIsEditing(false)} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to List
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={attorney.profileImage} />
                <AvatarFallback className="text-xl">
                  {attorney.firstName[0]}{attorney.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold">
                {attorney.firstName} {attorney.lastName}
              </h2>
              
              <Badge className="mt-2" variant={
                attorney.role === 'Partner' ? 'default' :
                attorney.role === 'Associate' ? 'secondary' :
                attorney.role === 'Paralegal' ? 'outline' : 'destructive'
              }>
                {attorney.role}
              </Badge>
              
              <p className="text-muted-foreground mt-2">
                {attorney.specialization}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">{attorney.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-sm text-muted-foreground">{attorney.phone}</p>
                </div>
              </div>
              
              {attorney.barNumber && (
                <div className="flex items-start">
                  <Scale className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bar Number</h4>
                    <p className="text-sm text-muted-foreground">{attorney.barNumber}</p>
                  </div>
                </div>
              )}
              
              {attorney.officeLocation && (
                <div className="flex items-start">
                  <Building className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Office Location</h4>
                    <p className="text-sm text-muted-foreground">{attorney.officeLocation}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <Tabs defaultValue="overview">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Attorney Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Biography</h3>
                  <p className="text-muted-foreground">
                    {attorney.bio || "No biography provided."}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Contract Negotiation', 'Merger & Acquisitions', 'Corporate Law', 'Litigation Strategy'].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{new Date(attorney.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p>{new Date(attorney.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={attorney.isActive ? "success" : "destructive"}>
                        {attorney.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cases">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Cases</h3>
                  <p className="text-muted-foreground mb-4">
                    This attorney is not currently assigned to any cases.
                  </p>
                  <Button onClick={() => navigate('/cases/create')}>
                    Assign to New Case
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no documents associated with this attorney.
                  </p>
                  <Button onClick={() => navigate('/documents')}>
                    Create Document
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AttorneyDetail;
