
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, FileText, FolderOpen, FileHeart, Calendar, MessageSquare, File, Search, Download } from 'lucide-react';
import PatientsDashboard from '@/components/patients/PatientsDashboard';
import PatientsCaseReport from '@/components/patients/PatientsCaseReport';
import PatientsDocuments from '@/components/patients/PatientsDocuments';
import PatientsMedicalRecords from '@/components/patients/PatientsMedicalRecords';
import PatientsAppointments from '@/components/patients/PatientsAppointments';
import PatientsCommunication from '@/components/patients/PatientsCommunication';
import PatientsLegalDocuments from '@/components/patients/PatientsLegalDocuments';

const Patients: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Helmet>
        <title>Patients Portal - LAW ERP 500</title>
      </Helmet>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patients Portal</h1>
            <p className="text-muted-foreground">
              View your case details, documents, and appointments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Case Summary
            </Button>
          </div>
        </div>

        <Routes>
          <Route index element={<PatientsDashboard />} />
          <Route path="case-report" element={<PatientsCaseReport />} />
          <Route path="documents" element={<PatientsDocuments />} />
          <Route path="medical-records" element={<PatientsMedicalRecords />} />
          <Route path="appointments" element={<PatientsAppointments />} />
          <Route path="communication" element={<PatientsCommunication />} />
          <Route path="legal-documents" element={<PatientsLegalDocuments />} />
        </Routes>
      </div>
    </PageLayout>
  );
};

export default Patients;
