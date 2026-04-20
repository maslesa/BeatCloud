import { useNavigate } from 'react-router-dom';
import { downloadTrack } from '../api/track.api';
import Waveform from './Waveform';

export default function TrackCard({ track, loggedUser, onDelete }) {
    const navigate = useNavigate();

    const trackId = track.id;

    const handleDeleteClick = () => {
        onDelete(trackId);
    };

    const handleEditClick = () => {
        navigate(`/track/${trackId}/update`, { state: { track } });
    };

    const handleTrackDetailsClick = () => {
        navigate(`/track/${trackId}`, { state: { track } });
    }

    const handleAuthorClick = () => {
        navigate(`/profile/${track.author?.username}`);
    };

    return (
        <div className="w-full h-80 flex flex-col gap-3 bg-linear-to-r from-mybg2/30 to-mybg2/60 rounded-md p-3">
            <div className="w-full h-1/2 flex gap-2">
                <img
                    onClick={handleTrackDetailsClick}
                    className="min-w-40 max-w-40 max-h-40 object-cover rounded-md cursor-pointer"
                    src={track.coverURL}
                    alt={track.title}
                />

                <div className="w-full h-full relative">
                    <div className="w-full h-3/4 flex items-center justify-baseline p-3 gap-3">
                        <button className="cursor-pointer hover:scale-105 duration-200">
                            <img className="w-20" src="/icons/play.png" alt="Play" />
                        </button>
                        <div className="flex flex-col items-baseline gap-1 font-bold text-mylight">
                            <p
                                onClick={handleAuthorClick}
                                className="opacity-60 cursor-pointer hover:opacity-100 duration-200"
                            >
                                {track.author?.username || "Unknown"}
                            </p>
                            <p onClick={handleTrackDetailsClick} className="text-2xl cursor-pointer">{track.title}</p>
                        </div>
                    </div>

                    <div className="flex w-full h-1/4 px-3 items-center justify-between">
                        <div className="flex gap-2 w-1/2 h-full items-center">
                            <div title="like" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80">
                                <img className="w-5" src={track.isLiked ? '/icons/liked.png' : '/icons/like.png'} alt="Like" />
                                <p>{track.likes}</p>
                            </div>
                            <div title="comment" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80">
                                <img className="w-5" src="/icons/comment.png" alt="Comment" />
                                <p>0</p>
                            </div>

                            {track.isDownloadable && (
                                <div
                                    onClick={() => downloadTrack(trackId)}
                                    title="download"
                                    className="flex p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80"
                                >
                                    <img className="w-5" src="/icons/download.png" alt="Download" />
                                </div>
                            )}

                            {track.author?.username === loggedUser && (
                                <>
                                    <div
                                        onClick={handleDeleteClick}
                                        title="delete"
                                        className="flex p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80"
                                    >
                                        <img className="w-5" src="/icons/delete.png" alt="Delete" />
                                    </div>
                                    <div
                                        onClick={handleEditClick}
                                        title="edit"
                                        className="flex p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80"
                                    >
                                        <img className="w-5" src="/icons/edit.png" alt="Edit" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 w-1/2 h-full justify-end">
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

                    <div className="absolute top-2 right-2 flex gap-2 opacity-60 text-xs">
                        <img className="w-4 h-4" src="/icons/calendar.png" alt="" />
                        <p>{new Date(track.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-1/2 flex justify-center items-center rounded-lg">
                <Waveform track={track} />
            </div>
        </div>
    );
}