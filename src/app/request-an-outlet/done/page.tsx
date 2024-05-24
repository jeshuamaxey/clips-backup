import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";


const RequestOutletComplete = ({ searchParams } : {searchParams: { name?: string }}) => {
  const name = searchParams.name;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-6">
      <Heart size={48} />
      <h1 className="text-3xl">
        Thank you{name && ` ${name}`}!
      </h1>
      <p>
        Your feedback makes Story Safe better. We're working hard to make it accessible to more and more journalists.
      </p>
      <Button asChild>
        <Link href={"/"}>
          Home
        </Link>
      </Button>
    </div>
  );
}

export default RequestOutletComplete;