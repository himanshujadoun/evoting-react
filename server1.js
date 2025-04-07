const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin@123',
  database: 'evoting_db',
});

// Multer config to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eVoting API",
      version: "1.0.0",
      description: "API for managing election parties",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./server1.js"], // <-- change this to your actual file if it's not "server.js"
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/party:
 *   post:
 *     summary: Add a new election party
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Demo Party
 *               candidate_name:
 *                 type: string
 *                 example: John Doe
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Party added successfully
 */
app.post('/api/party', upload.single('image'), (req, res) => {
  const { name, candidate_name } = req.body;
  const image = req.file?.buffer;

  if (!name || !candidate_name || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = 'INSERT INTO election_party (name, candidate_name, image) VALUES (?, ?, ?)';
  db.query(sql, [name, candidate_name, image], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Party added successfully", partyId: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
