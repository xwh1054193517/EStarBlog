"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { MomentMusic } from "@/lib/types";

interface AudioTrack {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc?: string;
}

interface LyricLine {
  time: number;
  text: string;
}

interface MusicPlayerProps {
  music: MomentMusic;
}

export default function MusicPlayer({ music }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [audioList, setAudioList] = useState<AudioTrack[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const currentTrack = audioList[currentIndex] || null;
  const hasPlaylist = audioList.length > 1;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const parseLyrics = useCallback((lrcText: string): LyricLine[] => {
    if (!lrcText) return [];
    const lines = lrcText.split("\n");
    const lyricLines: LyricLine[] = [];

    for (const line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
      if (match && match[1] && match[2] && match[4]) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = match[3] ? parseInt(match[3].padEnd(3, "0")) : 0;
        const text = match[4].trim();
        if (text) {
          lyricLines.push({ time: minutes * 60 + seconds + milliseconds / 1000, text });
        }
      }
    }
    return lyricLines.sort((a, b) => a.time - b.time);
  }, []);

  const fetchLyrics = async (lrcUrl: string): Promise<string> => {
    try {
      const response = await fetch(lrcUrl);
      return await response.text();
    } catch {
      return "";
    }
  };

  const fetchMusicData = async () => {
    try {
      const { server, type, id } = music;
      const response = await fetch(`https://api.i-meto.com/meting/api?server=${server}&type=${type}&id=${id}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : [data];

      const tracks: AudioTrack[] = list.map((item: any) => ({
        name: item.name || item.title || "未知歌曲",
        artist: item.artist || item.author || "未知艺术家",
        url: item.url,
        cover: item.pic || item.cover || "",
        lrc: item.lrc || ""
      }));

      setAudioList(tracks);

      if (tracks[0]?.lrc) {
        const lrcText = tracks[0].lrc.startsWith("http") ? await fetchLyrics(tracks[0].lrc) : tracks[0].lrc;
        setLyrics(parseLyrics(lrcText));
      }

      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack?.url) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setLoadError(true));
    }
  };

  const playTrack = async (index: number) => {
    if (index < 0 || index >= audioList.length) return;
    setCurrentIndex(index);
    setShowPlaylist(false);

    const track = audioList[index];
    if (track?.lrc) {
      const lrcText = track.lrc.startsWith("http") ? await fetchLyrics(track.lrc) : track.lrc;
      setLyrics(parseLyrics(lrcText));
    } else {
      setLyrics([]);
    }
    setCurrentLyricIndex(-1);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = percent * duration;
  };

  const updateCurrentLyric = (time: number) => {
    if (lyrics.length === 0) return;
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i];
      if (lyric && time >= lyric.time) index = i;
      else break;
    }
    if (index !== currentLyricIndex) setCurrentLyricIndex(index);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      updateCurrentLyric(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
    if (hasPlaylist) {
      playTrack((currentIndex + 1) % audioList.length);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    fetchMusicData();
  }, [music]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("error", () => {
        setLoadError(true);
        setIsPlaying(false);
      });
    }
    return () => {
      if (audio) {
        audio.removeEventListener("play", () => setIsPlaying(true));
        audio.removeEventListener("pause", () => setIsPlaying(false));
        audio.removeEventListener("error", () => {});
      }
    };
  }, [currentTrack]);

  if (isLoading) {
    return (
      <div className="flec-music-player">
        <div className="player-status">
          <i className="ri-loader-4-line spin"></i>
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (loadError || !currentTrack) {
    return (
      <div className="flec-music-player">
        <div className="player-status">
          <i className="ri-error-warning-line"></i>
          <span>音乐加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flec-music-player">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="player-main">
        <div className="player-left">
          <div className="player-cover">
            {currentTrack.cover ? (
              <img src={currentTrack.cover} alt="cover" />
            ) : (
              <div className="cover-placeholder">
                <i className="ri-music-2-fill"></i>
              </div>
            )}
          </div>
          <button className="play-btn" onClick={togglePlay}>
            <i className={isPlaying ? "ri-pause-fill" : "ri-play-fill"}></i>
          </button>
        </div>

        <div className="player-right">
          <div className="player-info">
            <span className="track-name">{currentTrack.name}</span>
            <span className="separator"> - </span>
            <span className="track-artist">{currentTrack.artist}</span>
          </div>

          {lyrics.length > 0 && (
            <div className="player-lyrics">
              {lyrics.map((line, index) => (
                <div
                  key={index}
                  className={`lyric-line ${index === currentLyricIndex ? "active" : ""} ${index === currentLyricIndex + 1 ? "next" : ""}`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          )}

          <div className="player-progress">
            <div className="progress-bar" onClick={seekTo}>
              <div className="progress-played" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            {hasPlaylist && (
              <button className="ctrl-btn" onClick={() => setShowPlaylist(!showPlaylist)}>
                <i className="ri-menu-fill"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {showPlaylist && hasPlaylist && (
        <div className="player-playlist">
          {audioList.map((track, index) => (
            <div
              key={index}
              className={`playlist-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => playTrack(index)}
            >
              <span className="item-index">
                {index === currentIndex && isPlaying ? (
                  <i className="ri-equalizer-fill"></i>
                ) : (
                  index + 1
                )}
              </span>
              <span className="item-name">{track.name}</span>
              <span className="item-artist">{track.artist}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}