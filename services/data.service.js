//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import user model
const db = require('./db')
database= {
    1000: { acno: 1000, uname: "varsha", password: 1000, balance: 5000,transaction:[]},
    1001: { acno: 1001, uname: "remya", password: 1001, balance: 5000,transaction:[]},
    1002: { acno: 1002, uname: "oyishie", password: 1002, balance: 5000,transaction:[]}
  }
  //register definiton
 const register =(acno, password, uname)=> {
   //asynchronus
 return db.User.findOne({acno})
 .then(user=>{
  if(user){
    return {
      statusCode:422,
      status:false,
      message:"User already exists.....Please Log in"
  }
  }
  else{
    const newUser = new db.User({
      acno,
      uname,
      password,
      balance:0,
      transaction:[]
    })
    newUser.save()
    return {
      statusCode:200,
      status:true,
      message:"Successfully registered!!!"   
  }
  }
 })
  }
  //login definition
   const login= (acno,password)=> {
 
    //asynchronus
 return db.User.findOne({acno,password})
 .then(user=>{
   if(user){
    currentAcno =acno
    currentUname= user.uname
  
    //token generation
    const token =jwt.sign({
      currentAcno:acno
    },'supersecretkey123')
          return{
            statusCode:200,
            status:true,
            message:"Successfully Log In" ,
            currentAcno,
            currentUname,
            token
          }
   }
   else{
    return{
      statusCode:422,
      status:false,
      message:"incorrect password/Account Number"
  }
   }
  
 })
    // if (acno in database) {
    //   if (password == database[acno]["password"]) {
        
        
    //   }
    //   else {
            
    //   }
    // }
    // else {
    //     return {
    //     statusCode:422,
    //     status:false,
    //     message:"user doesn't exists"
    //   }
    // }
  }
  //deposit
   const deposit = (acno,password,amt)=> {
    var amount = parseInt(amt)

  
//asynchronous
return db.User.findOne({acno,password})
.then(user=>{
  if(user){
    user.balance+=amount
    user.transaction.push({
      amount:amount,
      type:"CREDIT"
     })
     user.save()
            return {
         statusCode:200,
         status:true,
         message:amount + "successfully deposited....and new balance is" + user.balance
     }
  }
  else{
    return{
      statusCode:422,
      status:false,
      message:"incorrect password/Account Number"
  }
  }
})
    }
//withdraw
 const withdraw = (req,acno,password,amt)=>{

    var amount = parseInt(amt)
    var  currentAcno = req.currentAcno

//asynchronous
return db.User.findOne({acno,password})
.then(user=>{
  if(user){
    if(user.balance>amount){
    user.balance -= amount
    user.transaction.push({
      amount:amount,
      type:"DEBIT"
     })
     user.save()
    return {
         statusCode:200,
         status:true,
         message:amount + "successfully debited....and new balance is" + user.balance
     }
  }
  else{
    return{
      statusCode:422,
      status:false,
      message:"Insufficient Balance"
  }
}
}
  if(currentAcno !=acno){
   
      return{
          statusCode:422,
          status:false,
          message:"Operation denied!!!!"
      }
    }
  
    
    
  else{
    return{
      statusCode:422,
      status:false,
      message:"incorrect Password/Account Number"
  }
  }
})
 }

  //transaction definition
 const  getTransaction = (acno)=>{

  //asynchronuos
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return{
        statusCode:200,
        status:true,
        transaction : user.transaction
  }
    }
    else{
      return {
          statusCode:422,
          status:false,
          message:"user doesnt exists"
        }
  }
  })
}  

//delete API
const deleteAcc = (acno)=>{
  //asynchronous
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statusCode:422,
        status:false,
        message:"Operation Failed!!!!"
      }
    }
    return{
        statusCode:200,
        status:true,
        message:"The requested account number "+acno+" deleted successfully!!!!"
  }
  })
}

  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction,
      deleteAcc
  }