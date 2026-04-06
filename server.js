const express = require("express");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

const app = express();


app.use(session({
  secret: 'LBC_TEst$%^&ooop', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true olny with HTTPS
    httpOnly: true 
  }
}));
app.get("/", (req, res) => {
  res.send("OK ROOT");
});


app.use(
    cors()
  );
  
app.use((req, res, next) => {
  console.log("REQUEST://", req.method, req.url);
  next();
});

app.use(passport.initialize());

app.use((err, req, res, next) => {
  console.error("❌ ERROR DETECTADO:");
  console.error(err.stack); 
  res.status(500).json({ 
    message: "Internal Server Error", 
    error: err.message 
  });
});


app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.use("/api/customers", require("./routes/customers"));

app.use("/api/loan", require("./routes/loan"));

app.use("/api/books", require("./routes/books"));

app.use("/api/chat", require("./routes/chat"));


app.listen(3001, () => console.log("Server running on port 3001"));
