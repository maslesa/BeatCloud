import TrackList from "../../track/components/TrackList";
import { useEffect, useState } from "react";
import { getAllTracks } from "../../track/api/track.api";
import { useAlertStore } from '../../../shared/hooks/useAlertStore';
import { useTracks } from "../../track/hooks/useTracks";

export default function Home() {

  const { tracks } = useTracks();

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold">Recent tracks</h1>
      <TrackList tracks={tracks} />
    </div>
  );
}