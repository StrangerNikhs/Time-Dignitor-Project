require('dotenv').config();
require('express-async-errors');
const app = require('./app');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 5000;

(async function start(){
  try{
    await connectDB(process.env.MONGO_URI);
    // redis client automatically connects on require; optionally: await redisClient.ping()
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  }catch(err){
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
