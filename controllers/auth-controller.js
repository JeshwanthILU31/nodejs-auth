const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register controller 
const registerUser = async(req,res) => {
    try{
       //extract user information from request body
       const {username, email, password, role} = req.body

       //check if the user is already exists in our database 
       const checkExistingUser = await User.findOne({$or: [{username},{email}]}) 

       if(checkExistingUser){
          return res.status(400).json({
            status: false,
            message: 'User is already exists either with same username or same email. Please try with different username or email'
          })
       }
     
      //hash user password

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)

      //create a new user and save in your database
      const newlyCreatedUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      })
       await newlyCreatedUser.save()

       if(newlyCreatedUser){
        res.status(201).json({
            success: true,
            message: 'User registered successfully!'
        })
       } else{
           res.status(400).json({
            success: false,
            message: 'Unable to register User! please try again'
           })
       }
    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message:'Something Went Wrong Try again!'
        })
    }
}


//login controller

const loginUser = async(req,res)=> {
    try{
      const {username, password} = req.body;

      //find if the current user exists in database or not
      const user = await User.findOne({username})
      if(!user) {
        return res.status(400).json({
            success : false,
            message : 'User doesnt exists!' 
        })
      }

      //if the password is correct or not 
      const isPasswordMatch = await bcrypt.compare(password,user.password)
      
      if(!isPasswordMatch){
        return  res.status(400).json({
            success : false,
            message : 'Invalid Credentials'
        })
      }


      //create user token 
      const accessToken = jwt.sign({
        userId: user._id,
        username: user.username,
        role: user.role
      },process.env.JWT_SECRET_KEY,{expiresIn: '30m'})

      res.status(200).json({
        success: true,
        message: 'Logged in successfull',
        accessToken
      })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message:'Something Went Wrong, Please try Again!'
        })
    }
}


const changedPassword = async(req,res)=> {
    try{
      const userId = req.userInfo.userId;

      //extract the old  and new password 
      const {oldPassword,newPassword} = req.body

      //find the current logged in user
      const user = await User.findById(userId);

      if(!user){
         return res.status(400).json({
            success: false,
            message:'User not found'
         })
      }

      //if the old password is correct
      const isPasswordMatch = await bcrypt.compare(oldPassword,user.password) 

      if(!isPasswordMatch){
        return res.status(400).json({
            success: false,
            message: "Old password is not correct! please try gain"
        })
      }

      //Hash the new password here 
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword,salt)

      //update new password
      user.password = newHashedPassword 
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      })

    }catch(e){
       console.log(e)
       return res.status(500).json({
            success: false,
            message:'Something Went Wrong, Please try Again!'
        })
    }
}
module.exports = {registerUser,loginUser,changedPassword};