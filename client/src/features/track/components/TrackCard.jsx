import { useNavigate } from 'react-router-dom';
import { downloadTrack } from '../api/track.api';

export default function TrackCard({ track, loggedUser, onDelete }) {
    const navigate = useNavigate();

    const trackId = track.id;    

    const handleDeleteClick = () => {
        const confirmed = window.confirm('Are you sure you want to delete this track?');
        if (confirmed) {
            onDelete(trackId);
        }
    };

    const handleEditClick = () => {
        navigate(`/track/${trackId}/update`, { state: { track } });
    };

    const handleAuthorClick = () => {
        navigate(`/profile/${track.author?.username}`);
    };

    return (
        <div className="w-full h-80 flex flex-col gap-3 bg-mybg2 rounded-md p-3">
            <div className="w-full h-1/2 flex gap-2">
                <img
                    className="min-w-40 max-w-40 max-h-40 object-cover rounded-md"
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
                            <p className="text-2xl cursor-default">{track.title}</p>
                        </div>
                    </div>

                    <div className="flex w-full h-1/4 px-3 items-center justify-between">
                        <div className="flex gap-2 w-1/2 h-full items-center">
                            <div title="like" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80">
                                <img className="w-5" src="/icons/like.png" alt="Like" />
                                <p>23</p>
                            </div>
                            <div title="comment" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mybg/80">
                                <img className="w-5" src="/icons/comment.png" alt="Comment" />
                                <p>10</p>
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
                                        className="flex p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-red-900/30"
                                    >
                                        <img className="w-5" src="/icons/delete.png" alt="Delete" />
                                    </div>
                                    <div
                                        onClick={handleEditClick}
                                        title="edit"
                                        className="flex p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer hover:bg-mylight/20"
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
                            <div className="flex p-2 px-3 h-10 bg-mybg items-center justify-center rounded-md text-sm">
                                Key: G min
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2 opacity-60 text-xs">
                        <img className="w-4 h-4" src="/icons/calendar.png" alt="" />
                        <p>{new Date(track.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-1/2 flex justify-center items-center rounded-lg">
                <div className="w-full h-4/5 flex items-center gap-px px-2 rounded-lg overflow-hidden">
                    {track.waveform?.length > 0 ? (
                        track.waveform.map((v, i) => (
                            <div
                                key={i}
                                className="bg-mylight opacity-80 hover:opacity-100 transition-opacity"
                                style={{
                                    height: `${v * 100}%`,
                                    width: "2px",
                                    minHeight: "2px",
                                }}
                            />
                        ))
                    ) : (
                        <div className="w-full h-0.5 bg-mylight/20"></div>
                    )}
                </div>
            </div>
        </div>
    );
}