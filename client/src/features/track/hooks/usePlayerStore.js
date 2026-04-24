import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
    currentTrackId: null,
    isPlaying: false,
    audio: null,
    progress: 0,

    playTrack: (track) => {
        const { audio, currentTrackId } = get();

        if (currentTrackId !== track.id) {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
            const newAudio = new Audio(track.audioURL);

            newAudio.ontimeupdate = () => {
                set({ progress: (newAudio.currentTime / newAudio.duration) * 100 });
            };

            newAudio.onended = () => {
                set({ isPlaying: false, progress: 0 });
                newAudio.currentTime = 0;
            };

            set({ audio: newAudio, currentTrackId: track.id, isPlaying: true, progress: 0 });
            newAudio.play();
        } else {
            if (get().isPlaying) {
                audio.pause();
                set({ isPlaying: false });
            } else {
                audio.play();
                set({ isPlaying: true });
            }
        }
    },

    stopAll: () => {
        const { audio } = get();
        if (audio) {
            audio.pause();
            audio.src = '';
            set({ audio: null, currentTrackId: null, isPlaying: false, progress: 0 });
        }
    },

    seek: (percent) => {
        const { audio } = get();
        if (audio && !isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
            set({ progress: percent * 100 });
        }
    },
}));