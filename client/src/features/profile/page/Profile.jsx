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
    </>
  );
}