import { useLocation, useNavigate, useParams } from "react-router-dom";
import Waveform from "../components/Waveform";
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useEffect, useState } from "react";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { deleteTrack, getSingleTrack, likeTrack } from "../api/track.api";
import { getComments, postComment } from '../../comment/api/comment.api';
import { usePlayerStore } from '../hooks/usePlayerStore';

export default function TrackPage() {
    const { trackID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const trackId = trackID;
    const [track, setTrack] = useState(null);
    const [liked, setLiked] = useState(track?.isLiked);
    const [likes, setLikes] = useState(track?.likesCount || 0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = useAuthStore((state) => state.user);
    const showAlert = useAlertStore((state) => state.showAlert);
    const { playTrack, currentTrackId, isPlaying } = usePlayerStore();
    const isThisPlaying = currentTrackId === track?.id && isPlaying;

    useEffect(() => {
        return () => usePlayerStore.getState().stopAll();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments(trackId);
                setComments(data.comments);
            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        }
        fetchComments();
    }, [trackId]);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const data = await getSingleTrack(trackId);
                setTrack(data.track);

                setLiked(data.track.isLiked);
                setLikes(data.track.likesCount || 0);

            } catch (error) {
                showAlert(error.response?.data?.message || error.message, "error");
            }
        };

        fetchTrack();
    }, [trackId]);

    if (!track) return <div className="w-full h-20 flex items-center justify-center font-bold opacity-60">Track not found</div>;

    const hasDescription = track.description && track.description.length > 0;

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

    const handleLike = async () => {
        const prevLiked = liked;

        setLiked(!prevLiked);
        setLikes(prev => prevLiked ? prev - 1 : prev + 1);

        try {
            await likeTrack(track.id);
        } catch (error) {
            setLiked(prevLiked);
            setLikes(prev => prevLiked ? prev + 1 : prev - 1);
        }
    };

    const handleAddComment = async () => {
        if (!commentInput.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const data = await postComment(trackId, commentInput);

            setComments(prev => [data.comment, ...prev]);
            setCommentInput('');
        } catch (error) {
            showAlert(error.response?.data?.message || error.message, "error");
        } finally {
            setIsSubmitting(false);
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
                <div className='relative w-full h-100 flex gap-5 rounded-md p-10 overflow-hidden bg-mybg2/30'>

                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${track.coverURL})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(20px) brightness(0.4)',
                            transform: 'scale(1.1)'
                        }}
                    />

                    <div className='relative z-10 flex-1 h-full flex flex-col justify-between overflow-hidden'>
                        <div className="w-full flex flex-col gap-5">
                            <div className='w-full flex gap-5'>
                                <button onClick={() => playTrack(track)} className="cursor-pointer hover:opacity-80 duration-200">
                                    <img className="w-16 md:w-20" src={isThisPlaying ? "/icons/pause.png" : "/icons/play.png"} alt="Play" />
                                </button>
                                <div className='flex flex-col w-full'>
                                    <div className="flex w-full justify-between mb-1">
                                        <h2 className='font-bold text-2xl md:text-4xl mb-1 text-mylight'>{track.title}</h2>
                                        <div className="flex gap-2 opacity-60 items-center">
                                            <img className="w-4 h-4" src="/icons/calendar.png" alt="" />
                                            <p className="text-sm">{new Date(track.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <h3 onClick={handleAuthorClick} className='font-semibold text-lg text-mylight opacity-60 hover:opacity-100 duration-200 cursor-pointer truncate'>
                                        {track.author?.username}
                                    </h3>
                                </div>
                            </div>
                            <div className="w-full h-10 flex items-center justify-between">
                                <div className="w-2/3 h-full flex gap-2">
                                    <div title="Plays" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md">
                                        <img className="w-5" src="/icons/plays.png" alt="Plays" />
                                        <p>{track.plays}</p>
                                    </div>
                                    <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-center rounded-md text-sm">
                                        {track.trackType?.charAt(0) + track.trackType?.slice(1).toLowerCase()}
                                    </div>
                                    {track.key && (
                                        <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-Acenter rounded-md text-sm">
                                            Key: {track.key
                                                .replaceAll("_", " ")
                                                .toLowerCase()
                                                .replace(/\b\w/g, (c) => c.toUpperCase())
                                            }
                                        </div>
                                    )}
                                    {track.bpm && (
                                        <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-Acenter rounded-md text-sm">
                                            {track.bpm} bpm
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-1/2 flex items-end rounded-lg opacity-80">
                            <Waveform track={track} />
                        </div>

                    </div>

                    <img
                        className="hidden md:block w-64 h-64 md:w-80 md:h-80 object-cover rounded-md drop-shadow-xl shrink-0"
                        src={track.coverURL}
                        alt={track.title}
                    />
                </div>
                <div className="w-full h-10 flex justify-between">
                    <div className="w-4/5 h-full flex gap-3">
                        <img onClick={handleAuthorClick} className="rounded-full cursor-pointer hover:opacity-80 duration-200" src={user?.profileImageURL || "/icons/default-avatar.png"} alt="" />
                        <input
                            className="w-1/2 h-full bg-mybg2 px-3 text-sm rounded-md outline-0"
                            placeholder="Write a comment..."
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                        <button onClick={handleAddComment} disabled={isSubmitting} className="flex items-center justify-center opacity-60 cursor-pointer hover:opacity-100 duration-200">
                            <img className="w-5" src="/icons/send.png" alt="" />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div onClick={handleLike} title={!liked ? 'like' : 'unlike'} className="flex gap-2 p-2 w-20 h-10 bg-mybg2 items-center justify-center rounded-md cursor-pointer hover:bg-mybg2/80">
                            <img className="w-5" src={liked ? '/icons/liked.png' : '/icons/like.png'} alt="Like" />
                            <p>{likes}</p>
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
                <div className="flex gap-5 mb-10">
                    <div className="flex flex-col w-1/2 min-h-50 gap-4">
                        <h2 className="font-bold text-md mb-1">Comments ({comments.length}):</h2>
                        <div className="flex flex-col gap-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                            {comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c.id} className="flex items-center gap-3 animate-in fade-in duration-500">
                                        <img
                                            onClick={() => navigate(`/profile/${c.user?.username}`)}
                                            className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer hover:opacity-80 duration-150"
                                            src={c.user?.profileImageURL || "/icons/default-avatar.png"}
                                            alt=""
                                        />
                                        <div className="flex flex-col bg-mybg2/30 p-3 rounded-lg w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <span onClick={() => navigate(`/profile/${c.user?.username}`)} className="text-xs font-bold text-mylight cursor-pointer hover:opacity-80 duration-150">{c.user?.username}</span>
                                                <span className="text-xs opacity-40">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm opacity-80 leading-relaxed">{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="opacity-40 text-sm">No comments yet. Be the first to comment!</div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 min-h-50">
                        <h2 className="font-bold text-md mb-3">Description:</h2>
                        <div className="w-full">
                            <p className={`text-sm text-mylight/90 whitespace-pre-line transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : 'line-clamp-none'}`}>
                                {track.description || "No description provided."}
                            </p>
                            {hasDescription && track.description.length > 50 && (
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