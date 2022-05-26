// import express
const express =require('express') 

const dataService =require('./services/data.service')
 
const jwt = require('jsonwebtoken')

const cors =require('cors')

//create an server app using express
const app =express()

//use cors to specify origin
app.use(cors({
origin:'http://localhost:4200'
}))

//to parse json
app.use(express.json()) 

//resolve http reqst from client

//GET- to read data
app.get('/',(req,res)=>{
res.status(401).send("IT'S A GET METHOD")
})

//POST- to create data
app.post('/',(req,res)=>{
    res.send("IT'S A POST METHOD")
    })
    
//PUT- to Update/modify data
app.put('/',(req,res)=>{
    res.send("IT'S A PUT METHOD")
    })

//PATCH- to update partially data
app.patch('/',(req,res)=>{
    res.send("IT'S A PATCH METHOD")
    })

//DELETE- to delete data
app.delete('/',(req,res)=>{
    res.send("IT'S A DELETE METHOD")
    })

    //application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log("Application specific middleware")
    next()
}
app.use(appMiddleware)

//bank app - API

//to verify token -middleware
const jwtmiddleware= (req,res,next)=>{
   try{ 
       const token =req.headers["x-access-token"]
    //verify token 
     const data = jwt.verify(token,'supersecretkey123')
    req.currentAcno = data.currentAcno
    next()
}
    catch{
        res.status(422).json({
            statusbar:422,
            status:false,
            message:"Please Log In"
        })
    }
}
//register API
app.post('/register',(req,res)=>{
    //asynchronous
 dataService.register(req.body.acno,req.body.password,req.body.uname)
 .then(result=>{
    res.status(result.statusCode).json(result)
 })
 
})

//login API
app.post('/login',(req,res)=>{
    //asynchronous
    dataService.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
    
})

//deposit API
app.post('/deposit',jwtmiddleware,(req,res)=>{
//asynchronous
 dataService.deposit(req.body.acno,req.body.password,req.body.amt)
 .then(result=>{
    res.status(result.statusCode).json(result)
 })
})

//withdraw API
app.post('/withdraw',jwtmiddleware,(req,res)=>{
    //asynchronous
  dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
  .then(result=>{
    res.status(result.statusCode).json(result);
 })
   })
 //transaction -API
 app.post('/transaction',jwtmiddleware,(req,res)=>{
//asynchronous
   dataService.getTransaction(req.body.acno)
   .then(result=>{
    res.status(result.statusCode).json(result);
 })
   })

   //deleteAccount  -API
   app.delete('/deleteAcc/:acno',jwtmiddleware,(req,res)=>{
    //asynchronus   
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result);
   })
})

//set up the port no
app.listen(3000,()=>{
    console.log("server started at port no:3000")
})