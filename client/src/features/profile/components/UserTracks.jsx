import TrackList from "../../track/components/TrackList";
import { useUserTracks } from "../../track/hooks/useUserTracks";
import { useParams } from 'react-router-dom';

export default function UserTracks() {

    const user = useParams();
    const { tracks } = useUserTracks(user.username);

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-bold">Tracks</h1>
            <TrackList tracks={tracks} />
        </div>
    );

}