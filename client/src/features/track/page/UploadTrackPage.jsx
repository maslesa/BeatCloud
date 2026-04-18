import { useState } from "react";
import { uploadTrack } from "../api/track.api";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useAlertStore } from '../../../shared/hooks/useAlertStore';

export default function UploadTrackPage() {
    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [trackType, setTrackType] = useState("SONG");
    const [isDownloadable, setIsDownloadable] = useState(false);

    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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
        if (!audio || !cover || !title) return alert("Missing fields");

        setIsLoading(true);
        const formData = new FormData();
        formData.append("audio", audio);
        formData.append("cover", cover);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("trackType", trackType);
        formData.append("isDownloadable", isDownloadable);

        try {
            await uploadTrack(formData, setProgress);
            navigate(`/profile/${user.username}`);
            showAlert("Track uploaded successfully.", "success");
        } catch (error) {
            showAlert(error.response?.data?.message || error.message, "error");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-8 p-5 relative">

            {isLoading && (
                <div className="fixed inset-0 z-10000 bg-black/80 flex flex-col items-center justify-center">
                    <div className="w-64 bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-500">
                        <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-white mt-4 font-bold">Uploading: {progress}%</p>
                </div>
            )}

            <div className="w-full flex flex-col md:flex-row gap-5">
                <div className="h-80 w-80 min-w-[320px]">
                    <label className="border-2 border-dashed border-mylight h-full w-full flex flex-col items-center justify-center relative cursor-pointer overflow-hidden rounded-md hover:bg-white/5 transition-all">
                        <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                        />
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
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
                        className="p-2 border-2 border-mylight outline-0 rounded-md bg-mybg"
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
                {!audio ? (
                    <label className="w-full h-24 border-2 border-dashed border-mylight rounded-md flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                        <input
                            className="hidden"
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                        />
                        <p className="text-lg font-medium tracking-wide">Upload audio file</p>
                    </label>
                ) : (
                    <div className="w-full p-4 border-2 rounded-md flex items-center gap-4">
                        <img className="w-5" src="/icons/note.png" alt="" />
                        <span className="text-md font-bold opacity-80 ">{audio.name}</span>
                        <button
                            onClick={() => setAudio(null)}
                            className="ml-auto text-sm bg-mybg2 hover:bg-mybg2/80 p-2 px-3 rounded cursor-pointer"
                        >
                            Change
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-between">
                <button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    disabled={isLoading}
                    className="bg-mybg2 hover:bg-mybg2/60 text-mylight font-bold py-3 px-10 rounded-md transition-colors cursor-pointer disabled:opacity-50 duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-mylight hover:bg-mylight/80 text-mybg2 font-bold py-3 px-10 rounded-md transition-colors cursor-pointer disabled:opacity-50 duration-200"
                >
                    Upload track
                </button>
            </div>
        </div>
    );
}