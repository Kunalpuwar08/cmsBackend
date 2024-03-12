const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get("/",async (req,res) => {
    res.send("Welcome To CMS Backend")
})

app.listen(port,() =>{
    console.log(`connection is live at port no ${port}`);
})