import TrackList from "../../track/components/TrackList";
import { useEffect, useState } from "react";
import { deleteTrack, getAllTracks } from "../../track/api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useTracks } from "../../track/hooks/useTracks";
import ConfirmModal from "../../../shared/components/ConfirmModal";

export default function Home() {

  const { tracks, setTracks } = useTracks();

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
    }
  }

  return (
    <>
      <div className="mt-5">
        <h1 className="text-2xl font-bold">Recent tracks</h1>
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