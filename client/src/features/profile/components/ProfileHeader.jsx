

export default function ProfileHeader({ user }) {
    if (!user) return null;

    return (
        <div className="w-full h-45 px-10 flex items-center justify-between bg-mybg2 rounded-lg">

            <div className="flex w-200 items-center gap-5">
                <img className={`w-30 rounded-full shadow-lg ${user.isVerified ? 'border-4 border-green-600' : 'border-0'}`} src={user.profileImageURL || "/icons/default-avatar.png"} alt="" />
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{user.username}</h2>
                    <h2 className="font-normal text-md opacity-60">{user.email}</h2>
                </div>
            </div>

            <div className="w-full h-full flex justify-end items-center gap-10">
                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Followers</p>
                    <p className="text-2xl font-bold">1.23M</p>
                </div>

                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Following</p>
                    <p className="text-2xl font-bold">35.3K</p>
                </div>

                <div className="flex flex-col gap-2 items-baseline">
                    <p className="opacity-60 text-xl">Tracks</p>
                    <p className="text-2xl font-bold">156</p>
                </div>
            </div>

        </div>
    );
}