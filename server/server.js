const express = require("express");
const connectDb = require("./config/db");
const app = express();
app.get("/", (req, res) => {
  res.send("api running");
});

app.use(express.json({extended:false}));

app.use('/api/users',require('./routes/api/uesers'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/posts',require('./routes/api/posts'))
app.use('/api/profile',require('./routes/api/profile'))

let port = 5000;
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
connectDb();
