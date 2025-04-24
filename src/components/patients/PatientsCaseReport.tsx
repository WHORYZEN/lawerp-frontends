
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

const PatientsCaseReport: React.FC = () => {
  const caseTimeline = [
    {
      date: "April 1, 2025",
      event: "Case Intake",
      description: "Initial consultation and case information gathered",
      status: "completed"
    },
    {
      date: "April 3, 2025",
      event: "Accident Documentation",
      description: "Police report and scene photos collected",
      status: "completed"
    },
    {
      date: "April 5, 2025",
      event: "Treatment Started",
      description: "Initial medical evaluation and treatment plan established",
      status: "completed"
    },
    {
      date: "April 18, 2025",
      event: "Medical Records Submitted",
      description: "Records from initial treatment submitted to insurance",
      status: "completed"
    },
    {
      date: "In Progress",
      event: "Continued Treatment",
      description: "Ongoing physical therapy and medical treatment",
      status: "in-progress"
    },
    {
      date: "Pending",
      event: "Case Settlement",
      description: "Negotiations with insurance company",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Case Report</h2>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Timeline</CardTitle>
          <CardDescription>Major events and milestones in your case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
            
            {/* Timeline events */}
            <div className="space-y-6">
              {caseTimeline.map((item, index) => (
                <div key={index} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1.5 h-8 w-8 rounded-full flex items-center justify-center
                    ${item.status === 'completed' ? 'bg-green-100' : 
                      item.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={`h-3 w-3 rounded-full
                      ${item.status === 'completed' ? 'bg-green-500' : 
                        item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-sm font-medium mr-2">{item.event}</h3>
                      <Badge variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'in-progress' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {item.status === 'completed' ? 'Completed' : 
                         item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{item.date}</p>
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Case Information</CardTitle>
          <CardDescription>Important details about your personal injury case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Accident Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Date:</span>
                  <span>April 1, 2025</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Location:</span>
                  <span>Main St & 5th Ave</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Type:</span>
                  <span>Vehicle Collision</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Police Report:</span>
                  <span>#PD-12345</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Insurance Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Claim Number:</span>
                  <span>ABC-123456</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Insurance:</span>
                  <span>ABC Insurance</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Adjustor:</span>
                  <span>John Smith</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Status:</span>
                  <span>Under Review</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Case Summary</CardTitle>
          <CardDescription>Latest update from your attorney</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-sm">
            <p>Dear Client,</p>
            <p className="mt-2">
              Your case is progressing as expected. We have submitted your initial medical records to the insurance company and are awaiting their response. You are currently in the "Active Treatment" phase, where it's important that you continue to attend all scheduled medical appointments and follow your treatment plan.
            </p>
            <p className="mt-2">
              Please be aware that you missed your physical therapy appointment on April 15. It's crucial for your case that you maintain consistent treatment. I've instructed my assistant to contact you to reschedule this appointment.
            </p>
            <p className="mt-2">
              Our next step will be to collect additional medical documentation once your current treatment phase is complete. We anticipate this will be in approximately 4-6 weeks, depending on your recovery progress.
            </p>
            <p className="mt-4 font-medium">
              Jane Doelawyer<br />
              Personal Injury Attorney<br />
              LYZ Law Firm
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsCaseReport;
