
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
      from: "Code Kids <noreply@codekids.com>",
      to: [email],
      subject: "Code Kids Registration Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Code Kids Registration Confirmation</h2>
          <p>Hello ${parentName},</p>
          <p>Thank you for registering your child with Code Kids! We've received your registration and are excited to have your child join our program.</p>
          <p>We'll be in touch shortly with next steps and class information.</p>
          <p>If you have any questions in the meantime, please don't hesitate to reach out.</p>
          <p>Best regards,<br>The Code Kids Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    console.log(`📧 Sent confirmation email to ${email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email confirmation sent successfully",
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
