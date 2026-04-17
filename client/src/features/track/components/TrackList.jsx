import TrackCard from "./TrackCard";
import { useAuthStore } from '../../auth/store/useAuthStore';

export default function TrackList({ tracks, onDelete }) {

    const user = useAuthStore((state) => state.user);

    return (
        <div className="w-full py-5 flex flex-col gap-5">
            {tracks.map((track) => (
                <div key={track.id}>
                    <TrackCard track={track} loggedUser={user.username} onDelete={onDelete} />
                </div>
            ))}
        </div>
    );

}