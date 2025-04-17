
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
    
    // In a real implementation, you would integrate with an email service like SendGrid
    // For example, using the SendGrid API (you would need to set up a SendGrid API key)
    // This is a simplified example showing how the integration would work
    
    // Define the email content
    const emailContent = {
      to: email,
      from: "noreply@codekids.com", // Replace with your verified sender
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
    };
    
    console.log(`📧 Sending email to ${email} for parent ${parentName}`);
    console.log("Email content:", emailContent);
    
    // Uncomment and modify this section when you have set up your email service
    /*
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "noreply@codekids.com" },
        subject: "Code Kids Registration Confirmation",
        content: [{ type: "text/html", value: emailContent.html }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }
    */
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email confirmation sent successfully",
        details: "For full implementation, set up SendGrid or another email service" 
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
