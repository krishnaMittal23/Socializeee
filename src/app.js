const express = require('express');
const app = express();
app.use(express.json());


app.use("/hello", (req,res)=>{
    res.send("Hello World");
    
})


app.use("/", (req, res) => {
    res.send("namaste")
    //surpasses all routes
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})