const express = require('express');
const app = express();
app.use(express.json());


// app.use("/hello", (req,res)=>{
//     res.send("Hello World");
    
// })

//   .use will match all the HTTP methods (GET, POST, PUT, DELETE, etc.)

// app.use("/", (req, res) => {
//     res.send("namaste")
//     //surpasses all routes
// })

app.get("/user")

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})