import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import ProfileHeader from "../components/ProfileHeader";
import UserTracks from "../components/UserTracks";
import { useUser } from "../../user/hooks/useUser";

export default function Profile() {

  const userUsername = useParams();
  const user = useUser(userUsername.username);

  return (
    <>
    <ProfileHeader user={user.user}/>
    <UserTracks/>
    <div className="flex flex-col gap-2 items-center justify-center w-full h-30 mb-5">
      <a href="/home" className="opacity-60 hover:opacity-100 cursor-pointer duration-200"><img className="w-10" src="/icons/logo.png" alt="" /></a>
      <a href="/upload" className="bg-mylight text-mybg2 font-semibold py-1 px-5 rounded-md opacity-60 hover:opacity-100 cursor-pointer duration-200">
        Upload more
      </a>
    </div>
    </>
  );
}