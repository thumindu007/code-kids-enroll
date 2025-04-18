
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email) {
        toast.error("Invalid verification link");
        setIsVerifying(false);
        return;
      }

      try {
        const { error } = await supabase
          .from('registration_requests')
          .update({ status: 'verified' })
          .eq('email', email);

        if (error) throw error;
        
        toast.success("Email verified successfully!");
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify email. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-blue-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h1>
        
        {isVerifying ? (
          <div className="space-y-4">
            <p className="text-gray-600">Verifying your email address...</p>
            <div className="animate-pulse bg-blue-100 h-2 w-full rounded"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              {email ? 
                "Thank you for verifying your email address!" : 
                "Invalid verification link. Please use the link sent to your email."}
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
