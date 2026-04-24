import { create } from 'zustand';
import { incrementTrackPlays } from '../api/track.api';

export const usePlayerStore = create((set, get) => ({
    currentTrackId: null,
    isPlaying: false,
    audio: null,
    progress: 0,
    playTimer: null,

    playTrack: (track) => {
        const { audio, currentTrackId, playTimer } = get();

        const startPlayCounter = (trackId) => {
            if (get().playTimer) clearTimeout(get().playTimer);

            const timer = setTimeout(async () => {
                try {
                    await incrementTrackPlays(trackId);
                } catch (error) {
                    console.error("Greška pri ažuriranju plays:", error);
                }
            }, 10000);

            set({ playTimer: timer });
        };

        if (currentTrackId !== track.id) {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
            if (playTimer) clearTimeout(playTimer);

            const newAudio = new Audio(track.audioURL);

            newAudio.ontimeupdate = () => {
                set({ progress: (newAudio.currentTime / newAudio.duration) * 100 });
            };

            newAudio.onended = () => {
                set({ isPlaying: false, progress: 0 });
                newAudio.currentTime = 0;
                if (get().playTimer) clearTimeout(get().playTimer);
            };

            set({
                audio: newAudio,
                currentTrackId: track.id,
                isPlaying: true,
                progress: 0
            });

            newAudio.play();
            startPlayCounter(track.id);
        }

        else {
            if (get().isPlaying) {
                audio.pause();
                if (playTimer) clearTimeout(playTimer);
                set({ isPlaying: false, playTimer: null });
            } else {
                audio.play();
                set({ isPlaying: true });
                startPlayCounter(track.id);
            }
        }
    },

    stopAll: () => {
        const { audio, playTimer } = get();
        if (playTimer) clearTimeout(playTimer);
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        set({
            audio: null,
            currentTrackId: null,
            isPlaying: false,
            progress: 0,
            playTimer: null
        });
    },

    seek: (percent) => {
        const { audio, currentTrackId, playTrack } = get();

        if (!audio || !currentTrackId) return;

        if (!isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
            set({ progress: percent * 100 });
        }
    },
}));