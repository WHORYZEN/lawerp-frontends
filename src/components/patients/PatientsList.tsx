
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, UserPlus, FileText, ClipboardList } from 'lucide-react';
import { Patient } from '@/backend/patients-api';
import { patientsApi } from '@/backend'; // Use patientsApi compatibility layer
import { useToast } from '@/hooks/use-toast';

interface PatientsListProps {
  onPatientSelect?: (patientId: string) => void;
}

const PatientsList: React.FC<PatientsListProps> = ({ onPatientSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const data = await patientsApi.getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  useEffect(() => {
    // Apply filters
    let result = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        patient => 
          patient.fullName.toLowerCase().includes(query) || 
          patient.accountNumber.toLowerCase().includes(query) ||
          (patient.email && patient.email.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(patient => patient.caseStatus.toLowerCase().includes(statusFilter.toLowerCase()));
    }
    
    setFilteredPatients(result);
  }, [searchQuery, statusFilter, patients]);

  const handlePatientClick = (patientId: string) => {
    if (onPatientSelect) {
      onPatientSelect(patientId);
    } else {
      navigate(`/patients/detail/${patientId}`);
    }
  };

  const handleAddPatient = () => {
    // This would navigate to a patient creation form
    toast({
      title: "Coming soon",
      description: "Patient creation functionality will be available soon.",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') && !statusLower.includes('inactive')) return "bg-green-100 text-green-800";
    if (statusLower.includes('closed') || statusLower.includes('inactive')) return "bg-red-100 text-red-800";
    if (statusLower.includes('review') || statusLower.includes('consultation')) return "bg-blue-100 text-blue-800";
    if (statusLower.includes('negotiation')) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 md:flex-row md:justify-between md:space-y-0">
        <div>
          <CardTitle>Patients List</CardTitle>
          <CardDescription>View and manage all patient records</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddPatient} className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 md:grid-cols-4 w-full md:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Attorney</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <TableCell className="font-medium">{patient.accountNumber}</TableCell>
                      <TableCell>{patient.fullName}</TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>
                        <div>
                          <div>{patient.email}</div>
                          <div className="text-xs text-muted-foreground">{patient.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.caseStatus)}>
                          {patient.caseStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>{patient.dateRegistered}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/case-report?id=${patient.id}`);
                        }}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/medical-records?id=${patient.id}`);
                        }}>
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
