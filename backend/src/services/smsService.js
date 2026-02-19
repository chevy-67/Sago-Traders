const axios = require("axios");

const sendSMS = async (phone, otp) => {
  console.log(`OTP for ${phone} is ${otp}`); // Demo mode

  // Production:
  /*
  await axios.post("SMS_PROVIDER_URL", {
    phone,
    message: `Your SaGo OTP is ${otp}`
  });
  */
};

module.exports = sendSMS;
