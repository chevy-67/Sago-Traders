const redisClient = require('./config/redis')

async function saveOTP(phone,otp){
    await redisClient.set(phone,120,otp)
}

async function verifyOTP(phone,otp){
    const storedOTP = redisClient.get(phone)
    return storedOTP == otp
}

module.exports = {saveOTP,verifyOTP}