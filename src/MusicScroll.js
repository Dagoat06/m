
# Build the full MusicScroll component with all requested features
full_code = '''
import { useState, useEffect, useRef } from 'react';

const initialMusicPosts = [
  { id: 1, title: 'Relaxing Lo-Fi', artist: 'Lo-Fi Beats', src: '/music/lofi.mp3', listens: 0 },
  { id: 2, title: 'Chill Vibes', artist: 'Chillstep', src: '/music/chill.mp3', listens: 0 },
  { id: 3, title: 'Ambient Sounds', artist: 'AmbientMix', src: '/music/ambient.mp3', listens: 0 },
];

const themes = {
  blue: { background: '#1e3a8a', box: '#3b82f6' },
  black: { background: '#111827', box: '#374151' },
  red: { background: '#7f1d1d', box: '#dc2626' },
};

const emojiList = ['😊', '🔥', '🎶', '👏', '💯', '❤️'];

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
  const [chatMessages, setChatMessages] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const currentPlaylist = showLiked ? likedSongs : musicPosts;
  const currentSong = currentPlaylist[current % currentPlaylist.length];
  const currentTheme = themes[theme];

  const nextSong = () => {
    const newIndex = (current + 1) % currentPlaylist.length;
    if (!showLiked && !showProfile && !showSettings) {
      const updated = [...musicPosts];
      const songId = currentPlaylist[newIndex].id;
      const index = updated.findIndex(s => s.id === songId);
      if (index !== -1) updated[index].listens += 1;
      setMusicPosts(updated);
    }
    setCurrent(newIndex);
  };

  const toggleLike = () => {
    const exists = likedSongs.find(song => song.id === currentSong.id);
    if (exists) {
      setLikedSongs(likedSongs.filter(song => song.id !== currentSong.id));
    } else {
      setLikedSongs([...likedSongs, currentSong]);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(f => isFollowing ? f - 1 : f + 1);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newSong = {
        id: musicPosts.length + 1,
        title: file.name.replace(/\\.[^/.]+$/, ''),
        artist: 'Uploaded',
        src: URL.createObjectURL(file),
        listens: 0,
      };
      setMusicPosts([...musicPosts, newSong]);
      setUploadedSongs([...uploadedSongs, newSong]);
      if (!showLiked && !showProfile && !showSettings) {
        setCurrent(musicPosts.length);
      }
    }
  };

  const handleScroll = (e) => {
    if (!showLiked && !showProfile && !showSettings && e.deltaY > 0) {
      nextSong();
    }
  };

  const sendEmoji = (emoji) => {
    setChatMessages([...chatMessages, emoji]);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  });

  const isLiked = likedSongs.some(song => song.id === currentSong.id);

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
          setShowProfile(true); setShowLiked(false); setShowSettings(false);
        }}>Profile</button>
        <button style={sidebarBtnStyle} onClick={() => {
          setShowLiked(prev => !prev); setShowProfile(false); setShowSettings(false); setCurrent(0);
        }}>{showLiked ? 'All Songs' : `Liked Songs (${likedSongs.length})`}</button>
        <button style={sidebarBtnStyle} onClick={() => fileInputRef.current.click()}>
          Upload Music ({uploadedSongs.length})
        </button>
        <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
        <button style={sidebarBtnStyle} onClick={() => {
          setShowLiked(false); setShowProfile(false); setShowSettings(false);
        }}>All Songs</button>
        <button style={sidebarBtnStyle} onClick={() => {
          setShowSettings(true); setShowProfile(false); setShowLiked(false);
        }}>Settings</button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden', padding: '1rem', flexDirection: 'column'
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
              width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%',
              overflow: 'hidden', marginBottom: '1rem', border: '2px solid white', cursor: 'pointer'
            }}>
              <img src={profileImage || 'https://via.placeholder.com/100'} alt="Profile"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <input type="file" accept="image/*" ref={profileInputRef}
                   onChange={handleProfileImageUpload} style={{ display: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
              <div><strong>{likedSongs.length}</strong><p style={{ fontSize: '0.8rem' }}>Likes</p></div>
              <div><strong>{followers}</strong><p style={{ fontSize: '0.8rem' }}>Followers</p></div>
              <div><strong>0</strong><p style={{ fontSize: '0.8rem' }}>Following</p></div>
            </div>
            <h3>Your Uploaded Songs ({uploadedSongs.length})</h3>
            <ul style={{ marginTop: '0.5rem' }}>
              {uploadedSongs.map(song => (
                <li key={song.id} style={{ fontSize: '0.9rem', padding: '4px 0' }}>{song.title}</li>
              ))}
            </ul>
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
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <img src={profileImage || 'https://via.placeholder.com/40'} alt="profile"
                   style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentSong.title}</h2>
            </div>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{currentSong.artist}</p>
            <audio controls autoPlay src={currentSong.src} style={{ width: '100%', height: '60px' }} />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={toggleLike} style={{
                backgroundColor: isLiked ? '#dc2626' : '#3b82f6',
                color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem'
              }}>{isLiked ? 'Unlike' : 'Like'}</button>
              <button onClick={toggleFollow} style={{
                backgroundColor: isFollowing ? '#6b7280' : '#10b981',
                color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem'
              }}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            </div>
            <p style={{ marginTop: '0.5rem', color: '#d1d5db' }}>
              Listens: {currentSong.listens}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <h4>Chat</h4>
              <div style={{
                backgroundColor: '#1f2937', padding: '0.5rem', minHeight: '50px',
                maxHeight: '80px', overflowY: 'auto', borderRadius: '0.5rem'
              }}>
                {chatMessages.map((msg, i) => (
                  <span key={i} style={{ margin: '0 5px' }}>{msg}</span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {emojiList.map((emoji, i) => (
                  <button key={i} onClick={() => sendEmoji(emoji)}
                          style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>{emoji}</button>
                ))}
              </div>
            </div>
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


# Save to the file
with open("/mnt/data/MusicScroll_Profile_Themes_Chat.js", "w") as f:
    f.write(full_code)

