import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";
import Hydrate from "@/providers/Hydrate";
import getQueryClient from "@/utils/getQueryClient";
import { createClient } from "@/utils/supabase/server";
import { dehydrate } from "@tanstack/react-query";

const ProfilePage = async () => {
  const supabase = createClient();

  const queryClient = getQueryClient()
  const { data: { user } } = await supabase.auth.getUser()
  await queryClient.prefetchQuery({ queryKey: ["profiles"], queryFn: async() => {
    const {data, error} = await supabase.from("profiles").select("*").filter("id", "eq", user?.id).single()
    return data
  }})
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex-1 w-full flex flex-col items-center">
        <Header />
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <ProfileEditor />
        </div>
      </div>
    </Hydrate>
  );
}

export default ProfilePage;