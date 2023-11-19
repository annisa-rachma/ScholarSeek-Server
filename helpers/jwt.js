const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

function signToken(data) {
    // console.log(secret);
    const token = jwt.sign(data, secret);
    return token;
}

function verifyToken(token) {
    // console.log(secret);
    const data = jwt.verify(token, secret);
    return data
}

module.exports = {
    signToken,
    verifyToken
}
