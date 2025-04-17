
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Code, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema with validation
const formSchema = z.object({
  childFirstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  childLastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  childAge: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Please enter a valid age.",
  }),
  parentName: z.string().min(2, {
    message: "Parent name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select a skill level.",
  }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childFirstName: "",
      childLastName: "",
      childAge: "",
      parentName: "",
      email: "",
      phone: "",
      skillLevel: "beginner",
      additionalInfo: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Insert registration data into Supabase
      const { error: insertError } = await supabase
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
        
      if (insertError) throw insertError;
      
      // Call edge functions to send notifications
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: { email: data.email, parentName: data.parentName }
        });
        
        await supabase.functions.invoke('send-confirmation-sms', {
          body: { phone: data.phone, parentName: data.parentName }
        });
      } catch (notificationError) {
        console.error("Notification error:", notificationError);
        // We don't want to fail the whole registration if just notifications fail
        toast.warning("Registration saved but notification delivery may be delayed");
      }
      
      // Show success state
      setIsSuccess(true);
      toast.success("Registration submitted successfully!");
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(error.message || "Failed to submit registration. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {isSuccess ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering. We've sent confirmation details to your email and phone.
          </p>
          <div className="text-sm text-gray-500">
            You'll be redirected back to the registration form shortly...
          </div>
        </div>
      ) : (
        <Form {...form}>
          <div className="flex items-center mb-6">
            <Code className="h-8 w-8 mr-3 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Code Kids Registration</h2>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Child's Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Child's Information</h3>
                
                <FormField
                  control={form.control}
                  name="childFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coding Skill Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (No experience)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Some basics)</SelectItem>
                          <SelectItem value="advanced">Advanced (Has coding experience)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select your child's current coding level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Parent/Guardian Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Parent/Guardian Information</h3>
                
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent/guardian name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} type="email" />
                      </FormControl>
                      <FormDescription>
                        We'll send confirmation and updates to this email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5551234567" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll send a confirmation text to this number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Additional Information */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific interests, needs, or questions..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Share any additional details that might help us prepare for your child
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm text-gray-600 mb-4">
              <span className="text-red-500">*</span> Indicates required fields
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit Registration"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
