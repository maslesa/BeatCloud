import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import ProfileHeader from "../components/ProfileHeader";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
    <ProfileHeader user={user}/>
    </>
  );
}