import { useRef } from 'react';
import { usePlayerStore } from '../hooks/usePlayerStore';

export default function Waveform({ track }) {
    const { currentTrackId, progress, seek, playTrack, isPlaying } = usePlayerStore();
    const waveformRef = useRef(null);

    const isCurrent = currentTrackId === track.id;

    const handleSeek = (e) => {
        const rect = waveformRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = x / width;

        if (!isCurrent) {
            playTrack(track);
            setTimeout(() => {
                seek(percent);
            }, 100);
        } else {
            seek(percent);
        }
    };

    return (
        <div
            ref={waveformRef}
            onClick={handleSeek}
            className="w-full h-3/5 flex items-center justify-between gap-px px-1 overflow-hidden cursor-pointer group"
        >
            {track.waveform?.length > 0 ? (
                track.waveform.map((v, i) => {
                    const barPosition = (i / track.waveform.length) * 100;
                    const isActive = isCurrent && progress >= barPosition;

                    return (
                        <div
                            key={i}
                            className={`transition-all duration-200 flex-1 ${isActive
                                    ? 'bg-mylight opacity-100'
                                    : 'bg-mylight/20 opacity-60 group-hover:opacity-80'
                                }`}
                            style={{
                                height: `${Math.max(v * 100, 5)}%`,
                            }}
                        />
                    );
                })
            ) : (
                <div className="w-full h-0.5 bg-mylight/20"></div>
            )}
        </div>
    );
}