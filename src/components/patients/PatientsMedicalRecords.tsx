
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PatientsMedicalRecords: React.FC = () => {
  const medicalProviders = [
    { id: "p1", name: "Dr. Sarah Smith", specialty: "Orthopedic Surgeon", facility: "City Medical Center", phone: "(555) 123-4567" },
    { id: "p2", name: "Dr. Michael Johnson", specialty: "Physical Therapist", facility: "PT Associates", phone: "(555) 234-5678" },
    { id: "p3", name: "Dr. Emily Lee", specialty: "Neurologist", facility: "Neurology Specialists", phone: "(555) 345-6789" }
  ];

  const treatments = [
    { id: "t1", date: "April 5, 2025", provider: "Dr. Sarah Smith", type: "Initial Evaluation", notes: "Patient presents with pain in lower back following vehicle collision. X-rays ordered." },
    { id: "t2", date: "April 7, 2025", provider: "Dr. Sarah Smith", type: "X-Ray Review", notes: "No fractures detected. Prescribed muscle relaxants and recommended physical therapy." },
    { id: "t3", date: "April 10, 2025", provider: "Dr. Michael Johnson", type: "PT Evaluation", notes: "Started physical therapy regimen focusing on lower back strengthening." },
    { id: "t4", date: "April 15, 2025", provider: "Dr. Michael Johnson", type: "PT Session", notes: "Patient missed appointment.", status: "missed" },
    { id: "t5", date: "April 18, 2025", provider: "Dr. Michael Johnson", type: "PT Session", notes: "Continued exercises. Patient reports slight improvement in pain levels." }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Medical Providers</CardTitle>
          <CardDescription>Healthcare professionals assigned to your case</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalProviders.map(provider => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.specialty}</TableCell>
                  <TableCell>{provider.facility}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Treatment History</CardTitle>
          <CardDescription>Record of your medical treatments and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map(treatment => (
                <TableRow key={treatment.id}>
                  <TableCell>{treatment.date}</TableCell>
                  <TableCell>{treatment.provider}</TableCell>
                  <TableCell>{treatment.type}</TableCell>
                  <TableCell>
                    {treatment.status === "missed" ? (
                      <Badge variant="destructive">Missed</Badge>
                    ) : (
                      <Badge variant="outline">Completed</Badge>
                    )}
                  </TableCell>
                  <TableCell>{treatment.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical Bill Summary</CardTitle>
          <CardDescription>Summary of medical expenses related to your case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Total Medical Bills</p>
                <p className="text-2xl font-bold mt-1">$7,850.00</p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Covered by Insurance</p>
                <p className="text-2xl font-bold mt-1">$2,450.00</p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Protected by LOP</p>
                <p className="text-2xl font-bold mt-1">$5,400.00</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Bill Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>City Medical Center</TableCell>
                    <TableCell>Emergency Room</TableCell>
                    <TableCell>April 5, 2025</TableCell>
                    <TableCell className="text-right">$3,500.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>City Medical Center</TableCell>
                    <TableCell>X-Rays</TableCell>
                    <TableCell>April 5, 2025</TableCell>
                    <TableCell className="text-right">$850.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dr. Sarah Smith</TableCell>
                    <TableCell>Initial Consultation</TableCell>
                    <TableCell>April 5, 2025</TableCell>
                    <TableCell className="text-right">$450.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dr. Sarah Smith</TableCell>
                    <TableCell>Follow-up Visit</TableCell>
                    <TableCell>April 7, 2025</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PT Associates</TableCell>
                    <TableCell>Physical Therapy (3 sessions)</TableCell>
                    <TableCell>April 10-18, 2025</TableCell>
                    <TableCell className="text-right">$2,800.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsMedicalRecords;
