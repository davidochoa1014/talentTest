const express = require("express");
const cors = require("cors");


const app = express();

app.get("/", (req, res) => {
  res.send("OK ROOT");
});


app.use(
    cors()
  );
  
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.use("/api/books", require("./routes/books"));

app.use("/api/chat", require("./routes/chat"));


app.listen(3001, () => console.log("Server running on port 3001"));
