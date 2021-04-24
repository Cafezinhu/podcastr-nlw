import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNextEpisode: () => void;
    playPreviousEpisode: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const play = (episode: Episode) => {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping);
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state);
    }

    const playNextEpisode = () => {
        let index = 0;
        if(isShuffling) {
            index = Math.floor(Math.random() * episodeList.length);
        } else {
            index = currentEpisodeIndex + 1;

            if(index >= episodeList.length) return;
        }

        setCurrentEpisodeIndex(index);
    }

    const playPreviousEpisode = () => {
        let index = currentEpisodeIndex - 1;

        if(index < 0) return;

        setCurrentEpisodeIndex(index);
    }

    return(
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                isPlaying, 
                isLooping,
                isShuffling,
                play, 
                playNextEpisode,
                playPreviousEpisode,
                togglePlay, 
                setPlayingState,
                playList,
                toggleLoop,
                toggleShuffle
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}