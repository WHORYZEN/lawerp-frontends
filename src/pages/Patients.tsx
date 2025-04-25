
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Search, Download, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import PatientsDashboard from '@/components/patients/PatientsDashboard';
import PatientsCaseReport from '@/components/patients/PatientsCaseReport';
import PatientsDocuments from '@/components/patients/PatientsDocuments';
import PatientsMedicalRecords from '@/components/patients/PatientsMedicalRecords';
import PatientsAppointments from '@/components/patients/PatientsAppointments';
import PatientsCommunication from '@/components/patients/PatientsCommunication';
import PatientsLegalDocuments from '@/components/patients/PatientsLegalDocuments';
import PatientsList from '@/components/patients/PatientsList';
import PatientDetail from '@/components/patients/PatientDetail';
import { useToast } from '@/components/ui/use-toast';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleDownloadCaseSummary = () => {
    toast({
      title: "Generating Case Summary",
      description: "Your comprehensive case summary is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Complete case summary has been downloaded successfully.",
      });
    }, 2000);
  };

  const defaultContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Patient Dashboard</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <PatientsDashboard />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Patients Overview</h2>
          </div>
          <PatientsList 
            onPatientSelect={(patientId) => {
              navigate(`/patients/detail/${patientId}`);
            }} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <Helmet>
        <title>Patients - LAW ERP 500</title>
      </Helmet>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Patients</h1>
              <p className="text-muted-foreground">
                View and manage all patient information and cases
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSearchClick}
                className="flex items-center gap-2 hover:bg-gray-100/80"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadCaseSummary}
                className="flex items-center gap-2 hover:bg-gray-100/80"
              >
                <Download className="h-4 w-4" />
                <span>Download Case Summary</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                onClick={() => navigate('/patients/case-report')}
              >
                <FileText className="h-4 w-4" />
                <span>View Reports</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <Routes>
            <Route index element={defaultContent} />
            <Route path="detail/:patientId" element={<PatientDetail />} />
            <Route path="case-report" element={<PatientsCaseReport />} />
            <Route path="documents" element={<PatientsDocuments />} />
            <Route path="medical-records" element={<PatientsMedicalRecords />} />
            <Route path="appointments" element={<PatientsAppointments />} />
            <Route path="communication" element={<PatientsCommunication />} />
            <Route path="legal-documents" element={<PatientsLegalDocuments />} />
          </Routes>
        </div>

        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <SheetContent side="right" className="w-full sm:w-[640px] sm:max-w-full">
            <SheetHeader>
              <SheetTitle>Search Patients</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <PatientsList onPatientSelect={(patientId) => {
                navigate(`/patients/detail/${patientId}`);
                setIsSearchOpen(false);
              }} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageLayout>
  );
};

export default Patients;
