import { useEffect, useState } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useAlertStore } from "../../../shared/hooks/useAlertStore";
import { toggleFollow } from "../api/follow.api";

export default function ProfileHeader({ user }) {

    const loggedInUser = useAuthStore((state) => state.user);
    
    const showAlert = useAlertStore((state) => state.showAlert);

    const [isFollowing, setIsFollowing] = useState(user?.isFollowing);
    const [followersCount, setFollowersCount] = useState(user?._count?.followers || 0);

    useEffect(() => {
        if (user) {
            setIsFollowing(user.isFollowing);
            setFollowersCount(user._count?.followers || 0);
        }
    }, [user]);

    if (!user) return null;

    const isOwnProfile = loggedInUser?.id === user.id;

    const handleFollowToggle = async () => {
        try {
            const data = await toggleFollow(user.id);

            setIsFollowing(data.isFollowing);

            setFollowersCount(prev => data.isFollowing ? prev + 1 : prev - 1);
        } catch (error) {
            showAlert(error.response?.data?.message || error.message, "error");
        }
    }

    const { following, tracks } = user._count || { following: 0, tracks: 0 };

    return (
        <div className="w-full h-45 px-10 flex items-center justify-between bg-mybg2 rounded-lg">

            <div className="flex w-200 items-center gap-5">
                <img className={`w-30 rounded-full shadow-lg ${user.isVerified ? 'border-4 border-green-600' : 'border-0'}`} src={user.profileImageURL || "/icons/default-avatar.png"} alt="" />
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{user.username}</h2>
                    <h2 className="font-normal text-md opacity-60">{user.email}</h2>
                    {!isOwnProfile && loggedInUser && (
                        <button onClick={handleFollowToggle} className="w-40 h-10 mt-2 flex gap-2 items-center justify-center bg-mybg rounded-md cursor-pointer hover:opacity-80 duration-200">
                            <img className="w-4" src={isFollowing ? '/icons/unfollow.png' : '/icons/follow.png'} alt="" />
                            <p>{isFollowing ? 'Unfollow' : 'Follow'}</p>
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full h-full flex justify-end items-center gap-10">
                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Followers</p>
                    <p className="text-2xl font-bold">{followersCount}</p>
                </div>

                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Following</p>
                    <p className="text-2xl font-bold">{following}</p>
                </div>

                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Tracks</p>
                    <p className="text-2xl font-bold">{tracks}</p>
                </div>
            </div>

        </div>
    );
}