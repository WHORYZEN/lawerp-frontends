
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, ChevronRight, Gavel, MessageCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  const features = [
    {
      icon: <Gavel className="h-6 w-6 text-primary" />,
      title: "Case Management",
      description: "Streamline all your legal cases with our powerful case management system"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "Client Communication",
      description: "Keep in touch with clients through secure messaging and document sharing"
    },
    {
      icon: <Bot className="h-6 w-6 text-primary" />,
      title: "AI Assistant",
      description: "Get help with any feature using our smart AI assistant available 24/7"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Secure & Compliant",
      description: "HIPAA compliant and secure infrastructure to protect sensitive data"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawfirm-blue via-white to-lawfirm-gray pt-16 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold text-lawfirm-dark-purple mb-4">
                LYZ Law Firm Management System
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Streamline your law practice with our comprehensive case management system.
                Handle clients, cases, billing, and more in one integrated platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-1 transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2342&auto=format&fit=crop"
                  alt="Law Firm Management"
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-lawfirm-dark-purple mb-4">
              Powerful Features for Modern Law Firms
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform helps law firms streamline operations, improve client communication, and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-lawfirm-gray inline-flex p-2 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-lawfirm-blue">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-lawfirm-dark-purple mb-4">
                Ready to transform your law practice?
              </h2>
              <p className="text-gray-700">
                Join thousands of law firms that have improved their efficiency and client satisfaction.
              </p>
            </div>
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="bg-primary hover:bg-primary/90 whitespace-nowrap"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-lawfirm-dark-purple text-white py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">&copy; {new Date().getFullYear()} LYZ Law Firm. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">Terms</a>
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">Privacy</a>
              <a href="#" className="text-white hover:text-lawfirm-blue transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
