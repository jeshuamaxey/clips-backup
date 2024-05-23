import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";


const VerifyToContinue = ({ searchParams } : {searchParams: { email?: "gmail" | "outlook" }}) => {
  const email = searchParams.email
  
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-6">
      <Send size={48} />
      <h1 className="text-3xl">
        Verify your email to continue
      </h1>
      <p>
        We have sent an email to your email address. Click the verification link in there to continue.
      </p>
      {email && (
        <Button asChild>
          <Link href={`https://${email}.com`}>
            Open {email}
          </Link>
        </Button>
      )}
    </div>
  );
}

export default VerifyToContinue;