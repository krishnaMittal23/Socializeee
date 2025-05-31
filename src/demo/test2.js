const express = require('express');
const app = express();
app.use(express.json());

app.use("/user", (req,res)=>{
    console.log("route user 1");
    res.send("response 1")
  },
  (req,res)=>{
    console.log("route user 2");
    res.send("response 2")
  }


)


//multiple route handlers
app.use("/user", (req,res,next)=>{
    console.log("route user 1");
    //res.send("response 1");
    next();
  },
  (req,res)=>{
    console.log("route user 2");
    res.send("response 2")
  }


)



//apply middleware to all routes with /admin
app.use("/admin",  (req,res,next)=>{
    const token = "abc";
    const isAuth = req.headers.authorization === token;
    if(!isAuth){
        return res.status(401).send("Unauthorized");
    }
    else{
        next();
    }
})

app.get("/admin/getAllData", (req,res)=>{
    res.send("all data sent")
})

app.get("/admin/deleteUser", (req,res)=>{
    res.send("all data delete")
})

//or
// app.get("/admin/deleteUser", middleware, (req,res)=>{
//     res.send("all data delete")
// })


// error handling

app.get("/getuserdata", (req,res)=>{

    //logic

    throw new Error("Something went wrong");
})


//error handling middleware
app.use("/", (err,req,res,next)=>{
    if(err){
        res.status(500).send("Internal Server Error: " + err.message);
    }
})


//or use try catch
app.get("/getuserdata", (req,res)=>{
    try {
        //logic
        throw new Error("Something went wrong");
    } catch (err) {
        res.status(500).send("Internal Server Error: " + err.message);
    }
})

app.listen(3000) 