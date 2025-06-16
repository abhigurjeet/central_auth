const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const  { v4:uuidv4 } =require('uuid');
const app = express();
const PORT = 4000;
const SECRET_KEY = 'your-secret-key';
const db = [];

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
const allowedDomains = [
  'http://localhost:5174',
];

app.post('/login', (req, res) => {
  const { email, password, redirectUri} = req.body;

  if (email === 'user@example.com' && password === 'password123') {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    let authcode = jwt.sign({},SECRET_KEY, { expiresIn: '1m' });
    let response = {
        success: true, token
    }
    if(redirectUri){
      const url = new URL(redirectUri);
      const origin = url.origin; 
      if(allowedDomains.includes(origin)){
        response['redirectAllowed']=true;
        response['authCode'] = authcode
      } else{
        response['redirectAllowed']=false;
      }
    }
    return res.json(response);
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});
app.get('/logout', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const index = db.indexOf(token);
    if (index > -1) {
      arr.splice(index, 1); 
    }
    res.json({ success: true, message: 'Logged out from all linked domains' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Logout error' });
  }
});

app.listen(PORT, () => {
  console.log(`IDP backend running on http://localhost:${PORT}`);
});
