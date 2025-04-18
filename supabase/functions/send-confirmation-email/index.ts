
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, parentName } = await req.json();
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Using Resend's verified domain
      to: [email],
      subject: "Code Kids - Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Code Kids Email Verification</h2>
          <p>Hello ${parentName},</p>
          <p>Thank you for registering with Code Kids! Please click the button below to verify your email address:</p>
          <a href="https://815986ff-6337-49f7-9621-d2b015673b0d.lovableproject.com/verify-email?email=${encodeURIComponent(email)}" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email Address
          </a>
          <p>If you didn't register with Code Kids, you can safely ignore this email.</p>
          <p>Best regards,<br>The Code Kids Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    console.log(`📧 Sent verification email to ${email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent successfully",
        details: data 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
