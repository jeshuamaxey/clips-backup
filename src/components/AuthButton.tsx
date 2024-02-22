import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default async function AuthButton() {
  const supabase = createClient();

  let profile;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(user) {
    const {data, error} = await supabase.from("profiles").select("*").eq("id", user?.id).single();
    if (error) {
      console.error(error);
    } else {
      profile = data;
    }
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  const username = profile?.first_name || user?.email;

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>Hey, {username}!</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/profile"} >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action={signOut}>
            <button className="flex">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
