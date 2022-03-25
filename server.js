const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const path = require("path")

const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



// mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true });

app.get("/", (req, res) => {
    
    
    
    res.send("./public/index.html")

})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});