import { useState, useEffect } from "react";
import { uploadTrack, updateTrack } from "../api/track.api";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useAlertStore } from '../../../shared/hooks/useAlertStore';

export default function UploadTrackPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const editTrack = location.state?.track || null;
    const isEditMode = !!editTrack;

    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);
    const [title, setTitle] = useState(editTrack?.title || "");
    const [description, setDescription] = useState(editTrack?.description || "");
    const [trackType, setTrackType] = useState(editTrack?.trackType || "SONG");
    const [isDownloadable, setIsDownloadable] = useState(editTrack?.isDownloadable || false);

    const [preview, setPreview] = useState(editTrack?.coverURL || null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const user = useAuthStore((state) => state.user);
    const showAlert = useAlertStore((state) => state.showAlert);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) setAudio(file);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCover(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!isEditMode && (!audio || !cover || !title)) return showAlert("Missing fields.", "error");
        if (isEditMode && !title) return showAlert("Title is required.", "error");

        setIsLoading(true);
        const formData = new FormData();
        
        if (audio) formData.append("audio", audio);
        if (cover) formData.append("cover", cover);
        
        formData.append("title", title);
        formData.append("description", description);
        formData.append("trackType", trackType);
        formData.append("isDownloadable", isDownloadable);

        try {
            if (isEditMode) {
                await updateTrack(editTrack.id, formData, setProgress);
                showAlert("Track updated successfully.", "success");
            } else {
                await uploadTrack(formData, setProgress);
                showAlert("Track uploaded successfully.", "success");
            }
            navigate(`/profile/${user.username}`);
        } catch (error) {
            showAlert(error.response?.data?.message || error.message, "error");
            setIsLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-8 p-5 relative">
            <h1 className="text-2xl font-bold">{isEditMode ? "Update track" : "Upload new track"}</h1>

            {isLoading && (
                <div className="fixed inset-0 z-10000 bg-black/80 flex flex-col items-center justify-center">
                    <div className="w-64 bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-500">
                        <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-white mt-4 font-bold">
                        {progress < 95 ? `Processing: ${progress}%` : "Finalizing..."}
                    </p>
                </div>
            )}

            <div className="w-full flex flex-col md:flex-row gap-5">
                <div className="h-80 w-80 min-w-[320px]">
                    <label className="border-2 border-dashed border-mylight h-full w-full flex flex-col items-center justify-center relative cursor-pointer overflow-hidden rounded-md hover:bg-white/5 transition-all">
                        <input className="hidden" type="file" accept="image/*" onChange={handleCoverChange} />
                        {preview ? (
                            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <img className="w-10" src="/icons/camera.png" alt="" />
                                <span className="text-sm opacity-60">Add cover...</span>
                            </div>
                        )}
                    </label>
                </div>

                <div className="w-full h-full flex flex-col gap-3">
                    <input
                        placeholder="Title"
                        className="p-2 border-2 border-mylight outline-0 rounded-md bg-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        className="p-2 resize-none h-43 border-2 border-mylight outline-0 rounded-md bg-transparent"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <select
                        value={trackType}
                        onChange={(e) => setTrackType(e.target.value)}
                        className="p-2 border-2 border-mylight outline-0 rounded-md bg-mybg cursor-pointer"
                    >
                        <option value="SONG">Song</option>
                        <option value="LOOP">Loop</option>
                        <option value="SAMPLE">Sample</option>
                        <option value="BEAT">Beat</option>
                        <option value="ACAPELLA">Acapella</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isDownloadable}
                            onChange={(e) => setIsDownloadable(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>Allow download</span>
                    </label>
                </div>
            </div>

            <div className="w-full">
                {!audio && !isEditMode ? (
                    <label className="w-full h-24 border-2 border-dashed border-mylight rounded-md flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                        <input className="hidden" type="file" accept="audio/*" onChange={handleAudioChange} />
                        <p className="text-lg font-medium tracking-wide">Upload audio file</p>
                    </label>
                ) : (
                    <div className="w-full p-4 border-2 rounded-md flex items-center gap-4 border-mylight">
                        <img className="w-5" src="/icons/note.png" alt="" />
                        <span className="text-md font-bold opacity-80 ">
                            {audio ? audio.name : "Original audio file (Keep existing)"}
                        </span>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-between">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-mybg2 hover:bg-mybg2/60 text-mylight font-bold py-3 px-10 rounded-md transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-mylight hover:bg-mylight/80 text-mybg2 font-bold py-3 px-10 rounded-md transition-all cursor-pointer disabled:opacity-50"
                >
                    {isEditMode ? "Save changes" : "Upload track"}
                </button>
            </div>
        </div>
    );
}