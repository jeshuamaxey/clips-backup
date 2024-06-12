import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";
import Hyperlink from "./Hyperlink";

const links = [{
  href: "/articles",
  label: "Articles",
}]

const Header = async ({ mb = true }: { mb?: boolean }) => {
  const superbase = createClient();
  const { data: { user } } = await superbase.auth.getUser()

  return (
    <nav className={`w-full flex justify-center border-b border-b-foreground/10 h-16 px-4 ${mb && "mb-8"}`}>
      <div className="w-full max-w-4xl flex space-between items-center text-sm">
        <div className="flex flex-row flex-1">
          <Hyperlink className="text-black" href="/">
            <h1 className="font-bold">My Story Safe</h1>
          </Hyperlink>
          {user && links.map(({href, label}) => (
            <Hyperlink key={href} href={href} className="ml-4">
              {label}
            </Hyperlink>
          ))}
        </div>
        <div className="flex flex-row flex-1 justify-end">
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}

export default Header;