"use client";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }).max(50),
  last_name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }).max(50),
  author_page: z.string().url().optional(),
  email: z.string().email()
})

const OutletRequestForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      author_page: "",
      email: ""
    },
  })

  const submitOutlet = async (values: z.infer<typeof formSchema>) => {
    const { first_name } = values;
    const supabase = createClient();

    const { error } = await supabase.from("outlet_requests").insert(values);

    let nextLink = `/request-an-outlet/done?name=${first_name}`

    return router.push(nextLink);
  }

  return (
    <Form {...form}>
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={form.handleSubmit(submitOutlet)}
        >
        <FormField
          control={form.control}
          name="first_name"
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
          name="last_name"
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
          name="author_page"
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

        <Button
          className="mb-2"
          type="submit"
        >
          Submit request
        </Button>
      </form>
    </Form>
  )
}

export default OutletRequestForm;