// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [fullname, setFullname] = useState('');
  const [grade, setGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [infoPanel, setInfoPanel] = useState('');
  const [adminPassword, setAdminPassword] = useState(null);
  const [banned, setBanned] = useState(false);
  
  // On mount, load userInfo from localStorage (if exists)
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }
  }, []);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullname || !grade) {
      alert('Please fill out both fields.');
      return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, grade }),
    });
    if (res.ok) {
      const info = { fullname, grade };
      localStorage.setItem('userInfo', JSON.stringify(info));
      setUserInfo(info);
    } else {
      alert('Registration failed.');
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    window.history.pushState({}, '', `?q=${encodeURIComponent(searchQuery)}`);
    const urls = [
      "https://www.google.com/search?q=",
      "https://www.bing.com/search?q=",
      "https://duckduckgo.com/?q="
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    setTimeout(() => {
      window.location.href = randomUrl + encodeURIComponent(searchQuery);
    }, 800);
  };
  
  const showInfo = async () => {
    let pass = adminPassword;
    if (!pass) {
      pass = prompt('Enter admin password:');
      if (!pass) return;
      setAdminPassword(pass);
    }
    const response = await fetch('/api/getinfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass, fullname: userInfo.fullname })
    });
    const text = await response.text();
    setInfoPanel(text);
    if (text.includes('BANNED_STATUS:TRUE')) {
      setBanned(true);
    } else if (text.includes('BANNED_STATUS:FALSE')) {
      setBanned(false);
    }
  };
  
  // Expose updateBan globally so that inline onclick calls in the API response can use it.
  const updateBan = async (action) => {
    let pass = adminPassword;
    if (!pass) {
      pass = prompt('Enter admin password:');
      if (!pass) return;
      setAdminPassword(pass);
    }
    const response = await fetch('/api/getinfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass, action, fullname: userInfo.fullname })
    });
    const text = await response.text();
    setInfoPanel(text);
    if (text.includes('BANNED_STATUS:TRUE')) {
      setBanned(true);
    } else if (text.includes('BANNED_STATUS:FALSE')) {
      setBanned(false);
    }
  };
  
  useEffect(() => {
    // Expose updateBan globally
    window.updateBan = updateBan;
  }, [adminPassword, userInfo]);
  
  if (!userInfo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Welcome! Please enter your information:</h1>
        <form onSubmit={handleRegister}>
          <div>
            <label>Full Name:</label>
            <input 
              type="text" 
              value={fullname} 
              onChange={e => setFullname(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Grade:</label>
            <input 
              type="text" 
              value={grade} 
              onChange={e => setGrade(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {banned ? (
        <div style={{ color: 'red', fontSize: '20px', margin: '20px' }}>
          <p>You are banned from using the website.</p>
          <p>Please use the Info panel to unban yourself if you have permission.</p>
        </div>
      ) : (
        <>
          <h1>Custom Search</h1>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ padding: '10px', width: '60%', fontSize: '18px' }}
              required
            />
            <button type="submit" style={{ padding: '10px 20px', fontSize: '18px', margin: '10px' }}>
              Search
            </button>
          </form>
        </>
      )}
      <button onClick={showInfo}>Info</button>
      <div 
        id="infoPanel" 
        dangerouslySetInnerHTML={{ __html: infoPanel }} 
        style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}
      ></div>
    </div>
  );
}
