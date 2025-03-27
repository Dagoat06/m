
import { useState, useEffect, useRef } from 'react';

const initialMusicPosts = [
  { id: 1, title: 'Relaxing Lo-Fi', artist: 'Lo-Fi Beats', src: '/music/lofi.mp3' },
  { id: 2, title: 'Chill Vibes', artist: 'Chillstep', src: '/music/chill.mp3' },
  { id: 3, title: 'Ambient Sounds', artist: 'AmbientMix', src: '/music/ambient.mp3' },
];

const themes = {
  blue: {
    background: '#1e3a8a',
    box: '#3b82f6',
  },
  black: {
    background: '#111827',
    box: '#374151',
  },
  red: {
    background: '#7f1d1d',
    box: '#dc2626',
  },
};

export default function MusicScroll() {
  const [musicPosts, setMusicPosts] = useState(initialMusicPosts);
  const [current, setCurrent] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [theme, setTheme] = useState('black');

  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const currentPlaylist = showLiked ? likedSongs : musicPosts;
  const currentSong = currentPlaylist[current % currentPlaylist.length];

  const nextSong = () => {
    setCurrent((prev) => (prev + 1) % currentPlaylist.length);
  };

  const toggleLike = () => {
    const alreadyLiked = likedSongs.find(song => song.id === currentSong.id);
    if (alreadyLiked) {
      setLikedSongs(likedSongs.filter(song => song.id !== currentSong.id));
    } else {
      setLikedSongs([...likedSongs, currentSong]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newSong = {
        id: musicPosts.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Uploaded',
        src: URL.createObjectURL(file),
      };
      setMusicPosts([...musicPosts, newSong]);
      setUploadedSongs([...uploadedSongs, newSong]);
      if (!showLiked && !showProfile && !showSettings) {
        setCurrent(musicPosts.length);
      }
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      if (showLiked || showProfile || showSettings) return;
      if (e.deltaY > 0) nextSong();
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentPlaylist, showLiked, showProfile, showSettings]);

  const isLiked = likedSongs.some(song => song.id === currentSong.id);
  const currentTheme = themes[theme];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: currentTheme.background,
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: '#0f172a',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <button style={sidebarBtnStyle} onClick={() => {
          setShowProfile(true);
          setShowLiked(false);
          setShowSettings(false);
        }}>Profile</button>

        <button style={sidebarBtnStyle} onClick={() => {
          setShowLiked(prev => !prev);
          setShowProfile(false);
          setShowSettings(false);
          setCurrent(0);
        }}>{showLiked ? 'All Songs' : `Liked Songs (${likedSongs.length})`}</button>

        <button style={sidebarBtnStyle} onClick={() => fileInputRef.current.click()}>
          Upload Music
        </button>

        <button style={sidebarBtnStyle} onClick={() => {
          setShowLiked(false);
          setShowProfile(false);
          setShowSettings(false);
        }}>All Songs</button>

        <button style={sidebarBtnStyle} onClick={() => {
          setShowSettings(true);
          setShowProfile(false);
          setShowLiked(false);
        }}>Settings</button>

        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {showProfile ? (
          <div style={{
            backgroundColor: currentTheme.box,
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div onClick={() => profileInputRef.current.click()} style={{
              width: '100px',
              height: '100px',
              margin: '0 auto',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '1rem',
              border: '2px solid white',
              cursor: 'pointer'
            }}>
              <img
                src={profileImage || 'https://via.placeholder.com/100'}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={profileInputRef}
              onChange={handleProfileImageUpload}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
              <div><strong>{likedSongs.length}</strong><p style={{ fontSize: '0.8rem' }}>Likes</p></div>
              <div><strong>0</strong><p style={{ fontSize: '0.8rem' }}>Followers</p></div>
              <div><strong>0</strong><p style={{ fontSize: '0.8rem' }}>Following</p></div>
            </div>
            <h3>Your Uploaded Songs</h3>
            {uploadedSongs.length > 0 ? (
              <ul style={{ marginTop: '0.5rem' }}>
                {uploadedSongs.map(song => (
                  <li key={song.id} style={{ fontSize: '0.9rem', padding: '4px 0' }}>{song.title}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>No uploads yet.</p>
            )}
          </div>
        ) : showSettings ? (
          <div style={{
            backgroundColor: currentTheme.box,
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center'
          }}>
            <h2>Theme Settings</h2>
            <button style={{ ...sidebarBtnStyle, backgroundColor: '#3b82f6' }} onClick={() => setTheme('blue')}>Blue</button>
            <button style={{ ...sidebarBtnStyle, backgroundColor: '#111827' }} onClick={() => setTheme('black')}>Black</button>
            <button style={{ ...sidebarBtnStyle, backgroundColor: '#dc2626' }} onClick={() => setTheme('red')}>Red</button>
          </div>
        ) : (
          <div style={{
            backgroundColor: currentTheme.box,
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{currentSong.title}</h2>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{currentSong.artist}</p>
            <audio controls autoPlay src={currentSong.src} style={{ width: '100%', height: '60px' }} />
            <button
              onClick={toggleLike}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: isLiked ? '#dc2626' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              {isLiked ? 'Unlike' : 'Like'}
            </button>
            <p style={{ marginTop: '1rem', color: '#d1d5db' }}>
              Scroll down to switch songs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const sidebarBtnStyle = {
  backgroundColor: '#374151',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  color: 'white',
  fontSize: '1rem',
  cursor: 'pointer',
  textAlign: 'left',
  marginTop: '0.25rem',
};
