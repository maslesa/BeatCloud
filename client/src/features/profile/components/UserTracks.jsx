import { deleteTrack } from "../../track/api/track.api";
import TrackList from "../../track/components/TrackList";
import { useUserTracks } from "../../track/hooks/useUserTracks";
import { useParams } from 'react-router-dom';
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useState } from "react";
import ConfirmModal from "../../../shared/components/ConfirmModal";

export default function UserTracks() {

    const user = useParams();
    const { tracks, setTracks } = useUserTracks(user.username);
    const showAlert = useAlertStore((state) => state.showAlert);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const openConfirmModal = (trackID) => {
        setSelectedTrack(trackID);
        setIsConfirmOpen(true);
    }

    const handleDelete = async (trackID) => {
        try {
            await deleteTrack(selectedTrack);
            setTracks((prev) => prev.filter((t) => t.id !== selectedTrack));
            showAlert("Track deleted successfully.", "success");
        } catch (error) {
            showAlert(error.response?.data?.message || error.message, "error");
        } finally {
            setIsConfirmOpen(false);
            setSelectedTrack(null);
        }
    }

    return (
        <>
            <div className="mt-5">
                <h1 className="text-2xl font-bold">Tracks</h1>
                <TrackList tracks={tracks} onDelete={openConfirmModal} />
            </div>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                message="This track will be permanently deleted."
            />
        </>
    );

}