function generateOTP(){
    const otp = Math.floor(Math.random*10000)
    return otp
}

module.exports = generateOTP