import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";

const ProfilePage = async () => {
  

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Header />
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <ProfileEditor />
      </div>
    </div>
  );
}

export default ProfilePage;