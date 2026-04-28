import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAlertStore } from "../../../shared/hooks/useAlertStore";
import { deleteTrack, searchTracks } from "../api/track.api";
import TrackList from "../components/TrackList";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { TrackListSkeleton } from "../../../shared/components/TrackListSkeletons";

export default function TrackSearch() {

    const [searchParams] = useSearchParams();
    const [tracks, setTracks] = useState([]);
    const showAlert = useAlertStore((state) => state.showAlert);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setIsLoading(true);
                const data = await searchTracks(searchParams.toString());
                setTracks(data.tracks);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            } finally {
                setIsLoading(false);
            }
        }

        fetchTracks();

    }, [searchParams]);

    return (
        <>
            <div className="mt-5">
                <h1 className="text-2xl font-bold">{searchParams.get("q") ? `Results for "${searchParams.get("q")}"` : "Search Results"}</h1>
                {tracks.length > 0 ?
                    (
                        isLoading ? <TrackListSkeleton /> : <TrackList tracks={tracks} onDelete={openConfirmModal} />
                    ) : (
                        <div className="h-50 w-full flex flex-col gap-5 justify-center items-center">
                            <img className="w-10 opacity-60" src="/icons/notfound.png" alt="" />
                            <p className="opacity-60">No tracks found matching your criteria.</p>
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