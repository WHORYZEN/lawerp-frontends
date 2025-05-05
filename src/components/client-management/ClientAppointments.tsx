
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, Clock } from "lucide-react";
import { clientsApi, Appointment } from "@/lib/api/client-api";
import { Badge } from '@/components/ui/badge';

interface ClientAppointmentsProps {
  clientId: string;
}

const ClientAppointments: React.FC<ClientAppointmentsProps> = ({ clientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appts = await clientsApi.getAppointments(clientId);
        setAppointments(appts);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getAppointmentsByStatus = (status: string = 'all') => {
    if (status === 'all') return appointments;
    return appointments.filter(apt => apt.visitStatus === status);
  };

  const getAppointmentStatusColor = (status: 'completed' | 'missed' | 'scheduled') => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = getAppointmentsByStatus(activeTab === 'all' ? 'all' : activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredAppointments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No appointments found in this category.</p>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-start space-x-4 p-4 rounded-md border">
                      <div className={`p-2 rounded-full ${
                        appointment.visitStatus === 'completed' ? 'bg-green-100' :
                        appointment.visitStatus === 'missed' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Calendar className={`h-5 w-5 ${
                          appointment.visitStatus === 'completed' ? 'text-green-600' :
                          appointment.visitStatus === 'missed' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{appointment.doctorFacilityName}</h3>
                          <Badge className={getAppointmentStatusColor(appointment.visitStatus)}>
                            {appointment.visitStatus.charAt(0).toUpperCase() + appointment.visitStatus.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{appointment.visitDate}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{appointment.visitTime}</span>
                        </div>
                        <p className="text-sm mt-2">{appointment.treatmentDescription || 'No description available'}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientAppointments;
