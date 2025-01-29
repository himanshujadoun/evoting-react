require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'client/build')));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
}));
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Read HTML template
const readHtmlTemplate = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

// Sanitize input to prevent SQL injection
const sanitizeInput = (input) => {
  return input.replace(/[^a-zA-Z0-9@. ]/g, '');
};

// Signup route
app.post('/signup', async (req, res) => {
  const { fullName, email, aadhar, password } = req.body;
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedAadhar = sanitizeInput(aadhar);
  const sanitizedFullName = sanitizeInput(fullName);
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists in users table
  db.query('SELECT * FROM users WHERE email = ?', [sanitizedEmail], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking existing user', error: err });
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // Check if user already exists in unverified_users table
    db.query('SELECT * FROM unverified_users WHERE email = ?', [sanitizedEmail], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error checking unverified user', error: err });
      if (results.length > 0) {
        return res.status(400).json({ message: 'Verification email already sent. Please check your email.' });
      }

      // Generate a verification token
      const verificationToken = uuidv4();

      db.query('INSERT INTO unverified_users (name, email, aadhar, password, verification_token) VALUES (?, ?, ?, ?, ?)', 
        [sanitizedFullName, sanitizedEmail, sanitizedAadhar, hashedPassword, verificationToken], (err, results) => {
          if (err) return res.status(500).json({ message: 'Error saving user data', error: err });

          // Read the HTML template
          const templatePath = path.join(__dirname, 'templates', 'verification-email.html');
          readHtmlTemplate(templatePath).then(htmlTemplate => {
            // Replace placeholders in the template
            const verificationLink = `http://${req.headers.host}/verify-email?token=${verificationToken}&email=${sanitizedEmail}`;
            const htmlContent = htmlTemplate.replace('{{verificationLink}}', verificationLink);

            // Send verification email
            const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'evoting.system.dei.ac.in@gmail.com',
                pass: 'dkjp uazo mohy npbv', // Replace with your App Password
              },
            });

            const mailOptions = {
              from: 'evoting.system.dei.ac.in@gmail.com',
              to: sanitizedEmail,
              subject: 'Email Verification',
              html: htmlContent,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) return res.status(500).json({ message: 'Error sending verification email', error: err });
              res.status(200).json({ message: 'Signup successful! Please verify your email.' });
            });
          }).catch(err => res.status(500).json({ message: 'Error reading email template', error: err }));
      });
    });
  });
});

// Login route
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   const sanitizedEmail = sanitizeInput(email);

//   db.query('SELECT * FROM users WHERE email = ?', [sanitizedEmail], (err, results) => {
//     if (err || results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });
//     const user = results[0];

//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err || !isMatch) return res.status(401).json({ message: 'Invalid email or password' });

//       if (!user.verified) {
//         return res.status(401).json({ message: 'Please verify your email before logging in' });
//       }

//       // Create a session or JWT token here
//       res.status(200).json({ message: 'Login successful!', usermail: user.email });
//     });
//   });
// });
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sanitizedEmail = sanitizeInput(email);

  db.query('SELECT * FROM users WHERE email = ?', [sanitizedEmail], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.verified) {
        return res.status(401).json({ message: 'Please verify your email before logging in' });
      }

      // Create a session or JWT token here
      res.status(200).json({ message: 'Login successful!', userId: user.id }); // Use user.id instead of user.email
    });
  });
});

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

// Middleware to protect routes

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  next();
};


app.post('/vote', (req, res) => {
  const { userId, partyId } = req.body;

  if (!userId || !partyId) {
    return res.status(400).json({ message: 'User ID and Party ID are required.' });
  }

  // Check if the user has already voted
  const checkVoteSql = 'SELECT * FROM votes WHERE user_id = ?';
  db.query(checkVoteSql, [userId], (err, results) => {
    if (err) {
      console.error('Error checking vote status:', err); // Log error
      return res.status(500).json({ message: 'Error checking vote status', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'You have already voted!' });
    }

    // Record the vote
    const voteSql = 'INSERT INTO votes (user_id, party_id) VALUES (?, ?)';
    db.query(voteSql, [userId, partyId], (err) => {
      if (err) {
        console.error('Error recording vote:', err); // Log error
        return res.status(500).json({ message: 'Error recording vote', error: err });
      }
      res.json({ message: 'Vote recorded successfully!' });
    });
  });
});

// Example protected route
app.get('/protected-route', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route' });
});

// Verify Email route
app.get('/verify-email', (req, res) => {
  const { token, email } = req.query;
  const sanitizedEmail = sanitizeInput(email);

  // Check if user already exists in users table
  db.query('SELECT * FROM users WHERE email = ?', [sanitizedEmail], (err, results) => {
    if (err) return res.status(500).send('<h1>Error checking existing user.</h1>');
    if (results.length > 0) {
      return res.send(`
        <html>
          <head>
            <title>Email Verification</title>
            <style>
              body {
                font-family: 'Poppins', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
              }
              .container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                font-size: 3.5rem;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>User already verified!</h1>
              <p>Your email is already verified. You can <a href="/login">log in</a> now.</p>
            </div>
          </body>
        </html>
      `);
    }

    db.query('SELECT * FROM unverified_users WHERE email = ? AND verification_token = ?', 
      [sanitizedEmail, token], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('<h1>Verification failed. Invalid or expired token.</h1>');
        const user = results[0];

        // Transfer user to the main users table
        db.query('INSERT INTO users (name, email, aadhar, password, verified) VALUES (?, ?, ?, ?, 1)', 
          [user.name, user.email, user.aadhar, user.password], (err, results) => {
            if (err) return res.status(500).send('<h1>Error saving verified user data.</h1>');

            // Remove user from unverified_users table
            db.query('DELETE FROM unverified_users WHERE email = ?', [sanitizedEmail], (err, results) => {
              if (err) return res.status(500).send('<h1>Error deleting unverified user data.</h1>');
              res.send(`
                <html>
                  <head>
                    <title>Email Verification</title>
                    <style>
                      body {
                        font-family: 'Poppins', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                      }
                      .container {
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                      }
                      h1 {
                        font-size: 3.5rem;
                        color: #333;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>Email verified successfully!</h1>
                      <p>Thank you for signing up. You can now <a href="/login">log in</a>.</p>
                    </div>
                  </body>
                </html>
              `);
            });
        });
    });
  });
});

// Fallback to serve index.html from the build folder if no other route matches
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
