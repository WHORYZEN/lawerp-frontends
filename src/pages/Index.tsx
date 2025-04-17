
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return null;
};

export default Index;
