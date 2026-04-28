import TrackList from "../../track/components/TrackList";
import { useEffect, useState } from "react";
import { deleteTrack, getAllTracks } from "../../track/api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useTracks } from "../../track/hooks/useTracks";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { TrackListSkeleton } from "../../../shared/components/TrackListSkeletons";

export default function Home() {

  const { tracks, setTracks } = useTracks();

  const showAlert = useAlertStore((state) => state.showAlert);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tracks && tracks.length > 0) setIsLoading(false);
  }, [tracks]);

  const openConfirmModal = (trackID) => {
    setSelectedTrack(trackID);
    setIsConfirmOpen(true);
  }

  const handleDelete = async (trackID) => {
    try {
      setIsConfirmOpen(false);
      await deleteTrack(selectedTrack);
      setTracks((prev) => prev.filter((t) => t.id !== selectedTrack));
      showAlert("Track deleted successfully.", "success");
    } catch (error) {
      setIsConfirmOpen(false);
      showAlert(error.response?.data?.message || error.message, "error");
    }
  }

  return (
    <>
      <div className="mt-5">
        <h1 className="text-2xl font-bold">Recent tracks</h1>
        {tracks.length > 0 ?
          (
            isLoading ? <TrackListSkeleton /> : <TrackList tracks={tracks} onDelete={openConfirmModal} />
          ) : (
            <div className="h-50 w-full flex flex-col gap-5 justify-center items-center">
              <img className="w-10 opacity-60" src="/icons/notfound.png" alt="" />
              <p className="opacity-60">There are no tracks to display.</p>
            </div>
          )}
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