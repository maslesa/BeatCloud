import TrackCard from "./TrackCard";

export default function TrackList({tracks}) {

    return(
        <div className="w-full py-5 flex flex-col gap-5">
            {tracks.map((track) => (
                <div key={track.id}>
                    <TrackCard track={track}/>
                </div>
            ))}
        </div>
    );

}