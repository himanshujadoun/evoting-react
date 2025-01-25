require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Add this line

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Add this line

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).send('Please login first.');
  }
  next();
}

// Serve login page for root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Serve the vote page
app.get('/vote.html', isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/public/vote.html');
});

// Fetch list of parties
app.get('/parties', (req, res) => {
  const sql = 'SELECT id, name, TO_BASE64(image) AS image FROM election_party';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching parties', error: err });
    } else {
      res.json(results);
    }
  });
});

// Fetch election parties with their candidates and images
app.get('/getParties', (req, res) => {
  const sql = 'SELECT id, name, candidate_name, TO_BASE64(image) AS image FROM election_party';

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching parties');
      return;
    }
    res.json(results);
  });
});

// Record the vote
app.post('/vote', isLoggedIn, (req, res) => {
  const { userId, partyId } = req.body;

  if (!userId || !partyId) {
    return res.status(400).json({ message: 'User ID and Party ID are required.' });
  }

  // Check if the user has already voted
  const checkVoteSql = 'SELECT * FROM votes WHERE user_id = ?';
  db.query(checkVoteSql, [userId], (err, results) => {
    if (err) {
      console.error('Error checking vote status:', err);
      return res.status(500).json({ message: 'Error checking vote status', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'You have already voted!' });
    }

    // Record the vote
    const voteSql = 'INSERT INTO votes (user_id, party_id) VALUES (?, ?)';
    db.query(voteSql, [userId, partyId], (err) => {
      if (err) {
        console.error('Error recording vote:', err);
        return res.status(500).json({ message: 'Error recording vote', error: err });
      }
      res.json({ message: 'Vote recorded successfully!' });
    });
  });
});

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Signup successful' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.cookie('userId', user.id, { httpOnly: true });

    res.status(200).json({ message: 'Login successful', userId: user.id, redirect: '/vote' });
  });
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
