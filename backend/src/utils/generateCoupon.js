const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCoupon(length = 6) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = generateCoupon;