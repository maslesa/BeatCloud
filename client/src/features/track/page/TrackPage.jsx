import { useLocation, useNavigate } from "react-router-dom";
import Waveform from "../components/Waveform";
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useState } from "react";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { deleteTrack } from "../api/track.api";

export default function TrackPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const track = location.state?.track || null;
    const hasDescription = track.description && track.description.length > 0;

    const user = useAuthStore((state) => state.user);
    const showAlert = useAlertStore((state) => state.showAlert);

    if (!track) return <div className="w-full h-20 flex items-center justify-center font-bold opacity-60">Track not found</div>;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleEditClick = () => {
        navigate(`/track/${track.id}/update`, { state: { track } });
    };

    const handleAuthorClick = () => {
        navigate(`/profile/${user?.username}`);
    };

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const handleDelete = async () => {
        try {
            setIsConfirmOpen(false);
            await deleteTrack(track.id);
            handleAuthorClick();
            showAlert("Track deleted successfully.", "success");
        } catch (error) {
            setIsConfirmOpen(false);
            showAlert(error.response?.data?.message || error.message, "error");
        }
    }

    return (
        <>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                message="This track will be permanently deleted."
            />
            <div className='flex flex-col w-full gap-5'>
                <div className='w-full h-100 flex gap-5 rounded-md bg-linear-to-r from-mybg2/30 to-mybg2/60 p-10'>

                    <div className='flex-1 h-full flex flex-col justify-between overflow-hidden'>

                        <div className="w-full flex flex-col gap-5">
                            <div className='w-full flex gap-5'>
                                <button className="cursor-pointer hover:opacity-80 duration-200">
                                    <img className="w-16 md:w-20" src="/icons/play.png" alt="Play" />
                                </button>
                                <div className='flex flex-col w-full'>
                                    <div className="flex w-full justify-between">
                                        <h2 className='font-bold text-2xl md:text-4xl mb-1 text-mylight'>{track.title}</h2>
                                        <div className="flex gap-2 opacity-60 items-center">
                                            <img className="w-4 h-4" src="/icons/calendar.png" alt="" />
                                            <p className="text-sm">{new Date(track.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <h3 onClick={handleAuthorClick} className='font-semibold text-lg md:text-xl text-mylight opacity-60 hover:opacity-100 duration-200 cursor-pointer truncate'>
                                        {track.author?.username}
                                    </h3>
                                </div>
                            </div>
                            <div className="w-full h-10 flex items-center justify-between">
                                <div className="w-2/3 h-full flex gap-2">
                                    <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-center rounded-md text-sm">
                                        {track.trackType?.charAt(0) + track.trackType?.slice(1).toLowerCase()}
                                    </div>
                                    <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-center rounded-md text-sm">
                                        Key: G min
                                    </div>
                                    <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-center rounded-md text-sm">
                                        Bpm: 130
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-1/2 flex items-end rounded-lg opacity-80">
                            <Waveform track={track} />
                        </div>

                    </div>

                    <img
                        className="hidden md:block w-64 h-64 md:w-80 md:h-80 object-cover rounded-md drop-shadow-xl shrink-0"
                        src={track.coverURL || track.coverUrl}
                        alt={track.title}
                    />
                </div>
                <div className="w-full h-10 flex justify-between">
                    <div className="w-4/5 h-full flex gap-3">
                        <img onClick={handleAuthorClick} className="rounded-full cursor-pointer hover:opacity-80 duration-200" src={user?.profileImageURL || "/icons/default-avatar.png"} alt="" />
                        <input className="w-1/2 h-full bg-mybg2 px-3 text-sm rounded-md outline-0" placeholder="Write a comment..." type="text" />
                        <button className="flex items-center justify-center opacity-60 cursor-pointer hover:opacity-100 duration-200">
                            <img className="w-5" src="/icons/send.png" alt="" />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div title="like" className="flex gap-2 p-2 w-20 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80">
                            <img className="w-5" src={track.isLiked ? '/icons/liked.png' : '/icons/like.png'} alt="Like" />
                            <p>{track.likes}</p>
                        </div>
                        <div title="comment" className="flex gap-2 p-2 w-20 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80">
                            <img className="w-5" src="/icons/comment.png" alt="Comment" />
                            <p>0</p>
                        </div>
                        {track.isDownloadable && (
                            <div
                                onClick={() => downloadTrack(trackId)}
                                title="download"
                                className="flex p-2 w-10 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80"
                            >
                                <img className="w-5" src="/icons/download.png" alt="Download" />
                            </div>
                        )}
                        {track.author?.username === user?.username && (
                            <>
                                <div
                                    onClick={handleEditClick}
                                    title="edit"
                                    className="flex p-2 w-10 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80"
                                >
                                    <img className="w-5" src="/icons/edit.png" alt="Edit" />
                                </div>
                                <div
                                    onClick={handleDeleteClick}
                                    title="delete"
                                    className="flex p-2 w-10 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80"
                                >
                                    <img className="w-5" src="/icons/delete.png" alt="Delete" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-5">
                    {/* Div for comments */}
                    <div className="flex flex-col w-1/2 min-h-50">
                        <h2 className="font-bold text-md mb-3">Comments:</h2>
                        <div className="opacity-60">
                            No comments.
                        </div>
                    </div>
                    {/* Div for desc */}
                    <div className="flex flex-col w-1/2 min-h-50">
                        <h2 className="font-bold text-md mb-3">Description:</h2>
                        <div className="w-full">
                            <p className={`text-sm text-mylight/90 whitespace-pre-line transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : 'line-clamp-none'}`}>
                                {track.description || "No description provided."}
                            </p>
                            {hasDescription && track.description.length > 10 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-xs font-bold text-mylight opacity-50 hover:opacity-100 cursor-pointer transition-all"
                                >
                                    {isExpanded ? "Read less" : "Read more"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}