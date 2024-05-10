const bcrypt = require('bcrypt');
const express = require("express");

const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken")

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const cors = require("cors");
const path = require("path");

app.use(cors({
   origin: "*", 
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE" 
  })
  );

const dbPath = path.join(__dirname, "database.db");



let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8050, () => {
      console.log("server Running in 3000");
    });
  } catch (err) {
    console.log(`DB Error: ${err.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


const createProductTable = async () => {
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      category TEXT,
      brand TEXT,
      image_url TEXT,
      price INTEGER,
      rating REAL,
      title TEXT
    )`);

  } catch (err) {
    console.log(`Error creating product table: ${err.message}`);
    process.exit(1);
  }
};

app.get('/', (req, res) => {
    res.send('products api running new deploy');
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.send({status:400, text:"Invalid user"})
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)

    if (isPasswordMatched === true) {
      const payload = {username:username}
      const jwtToken = jwt.sign(payload, "my_secret_token")
      response.send({jwtToken:jwtToken, text:"Logged In"})
    } else {
      response.send({statusCode:400, text:"Invalid Password"})
    }
  }
});

app.post("/newuser/", async (request, response) => {
  const { username,  password ,phoneNo,address} = request.body;
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (username, password, phoneNum,address) 
      VALUES 
        (
          '${username}', 
          '${hashedPassword}',
          '${phoneNo}', 
          '${address}'
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.send({status:`Created new user with id ${newUserId}`});
  } else {
    response.send({statusCode:400, text:"user already exit"})
  }
});



module.exports = app;

















