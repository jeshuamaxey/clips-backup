"use client"

import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useMyProfile from "@/hooks/useMyProfile";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/utils/supabase/types";
import { Button } from "./ui/button";
import useUpdateProfile from "@/hooks/useUpdateProfile";

const ProfileEditor = () => {
  const [loadingUser, setLoadingUser] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [tempProfile, setTempProfile] = useState<Profile | null>(null)
  const supabase = createClient();
  const profileQuery = useMyProfile();
  const profileMutation = useUpdateProfile();
  const {toast} = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: {user}, error } = await supabase.auth.getUser();
      console.log(user, error)
      if (error) {
        console.error(error);
        setLoadingUser(false);
        return;
      }
      setLoadingUser(false);
      setUser(user);
    }
    fetchUser();
  }, [])


  if(!loadingUser && !user) return <div>No user found</div>
  if(profileQuery.isLoading || loadingUser) return <div>Loading...</div>
  if(profileQuery.isError) return <div>Error fetching profile</div>
  if(!profileQuery.data) return <div>No profile found</div>
  
  const profile = profileQuery.data;
  
  if(!tempProfile) {
    setTempProfile(profile);
    return <div>Loading...</div>
  }

  const updateTempProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id;
    const value = key === "author_pages" ? [e.target.value] : e.target.value;
    setTempProfile({...tempProfile, [key]: value})
  }

  const saveProfile = async() => {
    await profileMutation.mutate(tempProfile)

    if(profileMutation.isError) {
      toast({
        title: "Error saving profile",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Profile saved",
        variant: "default"
      })
    }
  }

  return <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" defaultValue={user!.email} />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="first_name">First name</Label>
      <Input id="first_name" type="string" onChange={updateTempProfile} defaultValue={user?.user_metadata.first_name || ""} />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="last_name">Last name</Label>
      <Input id="last_name" type="string" onChange={updateTempProfile} defaultValue={user?.user_metadata.last_name || ""} />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="author_pages">Author page</Label>
      <Input id="author_pages" type="string" onChange={updateTempProfile} defaultValue={user?.user_metadata.author_pages ? user?.user_metadata.author_pages[0] : ""} />
    </div>

    <div className="flex">
      <Button
        onClick={saveProfile}
        disabled={profileMutation.isPending || JSON.stringify(tempProfile) === JSON.stringify(profile)}
        >
          {profileMutation.isPending ? "Saving..." : "Save changes"}
      </Button>
    </div>

  </div>
}

export default ProfileEditor;