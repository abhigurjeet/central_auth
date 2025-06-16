import React, { useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const [loggedIn,setLoggedIn] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const redirectUri = params.get('redirect_uri');
  const redirectAfterLogin = params.get('redirect_after_login') || '/dashboard';
  if (redirectUri) {
    localStorage.setItem('redirectUri', redirectUri);
    localStorage.setItem('redirectAfterLogin', redirectAfterLogin);
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    axios.get('http://localhost:4000/verify-token', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }).then(res => {
      if (res.data.success) {
        setMessage('Login successful.');
        setLoggedIn(true);
        if(redirectUri)
        window.parent.postMessage({ loggedIn: true, token}, '*');
      } else {
        setLoggedIn(false);
        if(redirectUri)
        window.parent.postMessage({ loggedIn: false }, '*');
      }
    }).catch(() => {
      if(redirectUri)
      window.parent.postMessage({ loggedIn: false }, '*');
    });
  }, []);
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/login', {
        email,
        password,
        redirectUri
      }, { withCredentials: true });
      if (res.data.success) {
          localStorage.setItem('token',res.data.token);
          setLoggedIn(true);
          setMessage('Login successful.');
          if(redirectUri){
            window.parent.postMessage({ loggedIn: true, token:res.data.token}, '*');
          }
      } else{
        setMessage(res.data.message);
      }
    } catch(err) {
      setMessage('Login failed.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Taxmann</h1>
      {!loggedIn &&
            <div><h2>SSO Login (IDP)</h2>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <br /><br />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
            <br /><br />
            <button onClick={handleLogin}>Login</button></div>
      }
      <p>{message}</p>
    </div>
  );
}

export default App;
