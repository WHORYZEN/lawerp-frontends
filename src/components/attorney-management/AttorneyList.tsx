
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Search, Trash2, UserPlus } from 'lucide-react';
import AttorneyForm from './AttorneyForm';
import { useToast } from "@/hooks/use-toast";
import { Attorney, attorneysApi } from '@/lib/api/attorneys-api';

interface AttorneyListProps {
  onViewAttorney: (id: string) => void;
  filter: 'all' | 'Partner' | 'Associate' | 'Paralegal' | 'Intern';
}

const AttorneyList = ({ onViewAttorney, filter }: AttorneyListProps) => {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadAttorneys = async () => {
      setIsLoading(true);
      try {
        const data = await attorneysApi.getAttorneys();
        setAttorneys(data);
      } catch (error) {
        console.error("Failed to load attorneys:", error);
        toast({
          title: "Error",
          description: "Failed to load attorneys. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAttorneys();
  }, [toast]);

  const filteredAttorneys = attorneys.filter(attorney => {
    const matchesFilter = filter === 'all' || attorney.role === filter;
    const matchesSearch = 
      attorney.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.barNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddAttorney = async (newAttorney: Omit<Attorney, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const attorney = await attorneysApi.createAttorney(newAttorney);
      
      setAttorneys([attorney, ...attorneys]);
      setShowAddForm(false);
      
      toast({
        title: "Attorney Added",
        description: `${attorney.firstName} ${attorney.lastName} has been added successfully.`
      });
    } catch (error) {
      console.error("Failed to add attorney:", error);
      toast({
        title: "Error",
        description: "Failed to add attorney. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAttorney = async (id: string) => {
    if (confirm('Are you sure you want to delete this attorney?')) {
      try {
        setIsLoading(true);
        const attorney = attorneys.find(a => a.id === id);
        await attorneysApi.deleteAttorney(id);
        
        setAttorneys(attorneys.filter(a => a.id !== id));
        
        toast({
          title: "Attorney Removed",
          description: `${attorney?.firstName} ${attorney?.lastName} has been removed.`,
          variant: "destructive"
        });
      } catch (error) {
        console.error("Failed to delete attorney:", error);
        toast({
          title: "Error",
          description: "Failed to delete attorney. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {showAddForm ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Attorney</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
            <AttorneyForm onSubmit={handleAddAttorney} onCancel={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attorneys..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Attorney
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <p>Loading attorneys...</p>
                </div>
              ) : filteredAttorneys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-muted-foreground mb-4">No attorneys found</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Attorney
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttorneys.map((attorney) => (
                      <TableRow key={attorney.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={attorney.profileImage} />
                              <AvatarFallback>
                                {attorney.firstName[0]}{attorney.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            {attorney.firstName} {attorney.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attorney.role === 'Partner' ? 'default' :
                              attorney.role === 'Associate' ? 'secondary' :
                              attorney.role === 'Paralegal' ? 'outline' : 'destructive'
                            }
                          >
                            {attorney.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{attorney.email}</TableCell>
                        <TableCell>{attorney.phone}</TableCell>
                        <TableCell>
                          <Badge variant={attorney.isActive ? "success" : "destructive"}>
                            {attorney.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewAttorney(attorney.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewAttorney(attorney.id)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAttorney(attorney.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AttorneyList;
