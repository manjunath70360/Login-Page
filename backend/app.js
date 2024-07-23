const bcrypt = require('bcrypt');
const express = require("express");

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");
const path = require("path");

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await createUserTable();
    const PORT = process.env.PORT || 8050;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log(`DB Error: ${err.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const createUserTable = async () => {
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      phoneNum TEXT,
      address TEXT
    )`);

  } catch (err) {
    console.log(`Error creating user table: ${err.message}`);
    process.exit(1);
  }
};

app.get('/', (req, res) => {
  res.send('User API running new deploy');
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400).json({ statusCode: 400, text: "Invalid user" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "my_secret_token");
      response.status(200).json({ jwtToken: jwtToken, statusCode: 200, text: "Logged In" });
    } else {
      response.status(400).json({ statusCode: 400, text: "Invalid Password" });
    }
  }
});

app.post("/newuser", async (request, response) => {
  const { username, password, phoneNo, address } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (username, password, phoneNum, address) 
      VALUES 
        (
          '${username}', 
          '${hashedPassword}',
          '${phoneNo}', 
          '${address}'
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.status(200).json({ statusCode: 200, text: `Created new user with id ${newUserId}` });
  } else {
    response.status(400).json({ statusCode: 400, text: "User already exists" });
  }
});

module.exports = app;
