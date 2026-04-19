export default function Waveform({ track }) {
    return (
        <div className="w-full h-3/5 flex items-center justify-between gap-px px-1 overflow-hidden">
            {track.waveform?.length > 0 ? (
                track.waveform.map((v, i) => (
                    <div
                        key={i}
                        className="bg-mylight opacity-80 hover:opacity-100 transition-opacity flex-1"
                        style={{
                            height: `${Math.max(v * 100, 5)}%`,
                        }}
                    />
                ))
            ) : (
                <div className="w-full h-0.5 bg-mylight/20"></div>
            )}
        </div>
    );
}