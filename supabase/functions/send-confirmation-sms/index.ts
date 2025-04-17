
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
    const { phone, parentName } = await req.json();
    
    // In a real implementation, you would integrate with an SMS service like Twilio
    // For example, using the Twilio API (you would need to set up a Twilio account)
    // This is a simplified example showing how the integration would work
    
    // Define the SMS content
    const smsContent = {
      to: phone,
      body: `Hello ${parentName}, thank you for registering with Code Kids! Your registration has been received. We'll be in touch soon with more details.`
    };
    
    console.log(`📱 Sending SMS to ${phone} for parent ${parentName}`);
    console.log("SMS content:", smsContent);
    
    // Uncomment and modify this section when you have set up your SMS service
    /*
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
      },
      body: new URLSearchParams({
        To: phone,
        From: twilioPhoneNumber,
        Body: smsContent.body
      }).toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send SMS: ${errorText}`);
    }
    */
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "SMS confirmation sent successfully",
        details: "For full implementation, set up Twilio or another SMS service" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in send-confirmation-sms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
