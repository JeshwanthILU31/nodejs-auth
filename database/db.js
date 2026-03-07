const mongoose = require('mongoose')

const connectToDb = async ()=> {
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log('MongoDb Connected Successfully')
    }catch(e){
        console.error('MongoDB connection failed')
        process.exit(1) 
    }
}
module.exports = connectToDb;