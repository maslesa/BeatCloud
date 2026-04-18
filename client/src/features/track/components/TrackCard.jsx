import { useNavigate } from 'react-router-dom';

export default function TrackCard({ track, loggedUser, onDelete }) {

    const navigate = useNavigate();

    const handleDeleteClick = () => {
        const confirmed = window.confirm('Are you sure you want to delete this track?');

        if (!confirmed) return;

        onDelete(track.id);
    }

    return (
        <div className="w-full h-80 flex flex-col gap-3 bg-mybg2 rounded-md p-3">
            <div className="w-full h-1/2 flex gap-2">
                <img className="min-w-40 max-w-40 max-h-40 object-cover rounded-md" src={track.coverURL} alt="" />
                <div className="w-full h-full relative">
                    <div className="w-full h-3/4 flex items-center justify-baseline p-3 gap-3">
                        <button className="cursor-pointer hover:scale-103 duration-200"><img className="w-20" src="/icons/play.png" alt="" /></button>
                        <div className="flex flex-col items-baseline gap-1 font-bold text-mylight">
                            <p onClick={() => navigate(`/profile/${track.author?.username}`)} className="opacity-60 cursor-pointer hover:opacity-100 duration-200">{track.author?.username || "Unknown"}</p>
                            <p className="text-2xl cursor-pointer">{track.title}</p>
                        </div>
                    </div>
                    <div className="flex w-full h-1/4 px-3 items-center justify-between">
                        <div className="flex gap-2 w-1/2 h-full items-center">
                            <div title="like" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                <img className="w-5" src="/icons/like.png" alt="" />
                                <p>23</p>
                            </div>
                            <div title="comment" className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                <img className="w-5" src="/icons/comment.png" alt="" />
                                <p>10</p>
                            </div>
                            <div title="copy link" className="flex gap-2 p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                <img className="w-5" src="/icons/copy.png" alt="" />
                            </div>
                            {track.isDownloadable && (
                                <div title="download" className="flex gap-2 p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                    <img className="w-5" src="/icons/download.png" alt="" />
                                </div>
                            )}
                            {track.author.username === loggedUser && (
                                <div title="delete" onClick={() => onDelete(track.id)} className="flex gap-2 p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                    <img className="w-5" src="/icons/delete.png" alt="" />
                                </div>
                            )}
                            {track.author.username === loggedUser && (
                                <div title="edit" className="flex gap-2 p-2 w-10 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                    <img className="w-5" src="/icons/edit.png" alt="" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 w-1/2 h-full justify-end">
                            <div className="flex gap-2 p-2 w-20 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                <p>{track.trackType.charAt(0).toUpperCase() + track.trackType.slice(1).toLowerCase()}</p>
                            </div>
                            <div className="flex gap-2 p-2 w-30 h-10 bg-mybg items-center justify-center rounded-md cursor-pointer">
                                <p>Key: G min</p>
                            </div>
                        </div>

                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-60">
                        <img className="w-5" src="/icons/calendar.png" alt="" />
                        <p>{new Date(track.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-1/2 bg-mybg flex justify-center items-center rounded-lg">
                div for soundwaves
            </div>
        </div>
    );
}