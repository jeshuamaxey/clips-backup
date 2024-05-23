"use client"

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }).max(50),
  lastName: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }).max(50),
  authorPage: z.string().url().optional(),
  email: z.string().email(),
  password: z.string().min(8),
})

const SignupForm = () => {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      authorPage: "",
      email: "",
      password: "",
    },
  })

  const signUp = async (values: z.infer<typeof formSchema>) => {
    const { email, password, firstName, lastName, authorPage } = values;

    const supabase = createClient();
    const origin  = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          author_pages: [authorPage],
        }
      },
    });

    if (error) {
      console.error(error)
      return router.push("/signup?message=Could not create user account");
    }

    let nextLink = "/signup/verify-to-continue"
    if (email.includes("gmail")) {
      nextLink += "?email=gmail"
    } else if (email.includes("outlook")) {
      nextLink += "?email=outlook"
    }
    return router.push(nextLink);
  }

  return (
    <Form {...form}>
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-8 text-foreground"
        onSubmit={form.handleSubmit(signUp)}
        >
        <div className="pb-8">
          <h1 className="text-3xl pb-4">It starts here.</h1>
          <p>Create a free account and start backing up your work in minutes.</p>
        </div>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                First name
              </FormLabel>
              <FormControl>
                <Input placeholder="Barney" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will appear on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Last name
              </FormLabel>
              <FormControl>
                <Input placeholder="Ronay" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will appear on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="authorPage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Link to your author page (optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="https://www.theguardian.com/profile/barneyronay" {...field} />
              </FormControl>
              <FormDescription>
                If you have more than one, you can add more later. This is where we'll look to find your articles.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Email
              </FormLabel>
              <FormControl>
                <Input placeholder="barney@theguardian.com" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Password
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Make it a good one
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <Button
          className="mb-2"
          type="submit"
        >
          Sign Up
        </Button>
      </form>
    </Form>
  )
}

export default SignupForm;