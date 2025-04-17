
# Supabase Integration Guide for Code Kids Enrollment

This document outlines how to implement the backend functionality for the Code Kids enrollment form once Supabase is connected to the project.

## 1. Database Setup

### Create a `registration_requests` Table

Once connected to Supabase, create a table with the following structure:

```sql
create table public.registration_requests (
  id uuid default gen_random_uuid() primary key,
  child_first_name text not null,
  child_last_name text not null,
  child_age integer,
  parent_name text not null,
  email text not null,
  phone text not null,
  skill_level text not null,
  additional_info text,
  created_at timestamp with time zone default now(),
  status text default 'pending'
);

-- Enable RLS
alter table public.registration_requests enable row level security;

-- Create policy to allow insertions
create policy "Allow anonymous insertions"
on public.registration_requests
for insert
to anon
with check (true);

-- Create policy to allow viewing own registrations
create policy "Users can view their own registrations"
on public.registration_requests
for select
using (auth.jwt() ->> 'email' = email);
```

## 2. API Implementation

### Modify the RegistrationForm Component

Update the `onSubmit` function in `RegistrationForm.tsx` to connect to Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (add this where appropriate)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Update the onSubmit function
async function onSubmit(data: FormValues) {
  setIsSubmitting(true);
  
  try {
    // Insert registration data into Supabase
    const { error } = await supabase
      .from('registration_requests')
      .insert({
        child_first_name: data.childFirstName,
        child_last_name: data.childLastName,
        child_age: parseInt(data.childAge),
        parent_name: data.parentName,
        email: data.email,
        phone: data.phone,
        skill_level: data.skillLevel,
        additional_info: data.additionalInfo || '',
      });
      
    if (error) throw error;
    
    // Call edge functions to send notifications
    await supabase.functions.invoke('send-confirmation-email', {
      body: { email: data.email, parentName: data.parentName }
    });
    
    await supabase.functions.invoke('send-confirmation-sms', {
      body: { phone: data.phone, parentName: data.parentName }
    });
    
    // Show success state
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 3000);
  } catch (error) {
    console.error("Error submitting form:", error);
    // Handle error state here
  } finally {
    setIsSubmitting(false);
  }
}
```

## 3. Edge Functions for Notifications

### Email Notification Function

Create a Supabase Edge Function for sending emails:

```typescript
// supabase/functions/send-confirmation-email/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, parentName } = await req.json();
    
    // In a real implementation, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For this example, we'll just log the action
    console.log(`📧 Sending email to ${email} for parent ${parentName}`);
    
    // Email sending logic would go here
    // Example with a service like SendGrid:
    /*
    const API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'noreply@codekids.com', name: 'Code Kids' },
        subject: 'Thank you for registering with Code Kids',
        content: [
          {
            type: 'text/html',
            value: `<p>Dear ${parentName},</p><p>Thank you for registering with Code Kids! We're excited to have your child join our program.</p>`,
          },
        ],
      }),
    });
    */
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
```

### SMS Notification Function

Create a Supabase Edge Function for sending SMS:

```typescript
// supabase/functions/send-confirmation-sms/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, parentName } = await req.json();
    
    // In a real implementation, you would integrate with an SMS service like Twilio
    // For this example, we'll just log the action
    console.log(`📱 Sending SMS to ${phone} for parent ${parentName}`);
    
    // SMS sending logic would go here
    // Example with Twilio:
    /*
    const ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const FROM_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`)}`,
      },
      body: new URLSearchParams({
        To: phone,
        From: FROM_NUMBER,
        Body: `Thank you for registering with Code Kids! We're excited to have your child join our program.`,
      }),
    });
    */
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
```

## 4. Implementation Steps

1. Connect the Lovable project to Supabase using the built-in integration
2. Create the `registration_requests` table in Supabase
3. Create the edge functions for email and SMS notifications
4. Update the RegistrationForm component to use Supabase
5. Test the full workflow

## 5. Recommended Email/SMS Service Providers

For production use, consider these services:

### Email Providers:
- SendGrid
- Mailgun
- Amazon SES

### SMS Providers:
- Twilio
- Nexmo (Vonage)
- MessageBird

Each of these can be integrated with Supabase Edge Functions to provide the notification functionality.
