import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";

const Header = () => {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 mb-8">
        <div className="w-full max-w-4xl flex justify-between items-center text-sm">
          <h1 className="font-bold">Clips Backup</h1>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
  )
}

export default Header;