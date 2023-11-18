const { verifyToken } = require('../helpers/jwt')
const {User} = require('../models')

const authentication = async (req, res, next) => {
    try {
        const {access_token} = req.headers
        if(!access_token) throw {name : "InvalidToken"}

        const verify = verifyToken(access_token)
        const user = await User.findByPk(verify.id)
        if(!user) throw {name : "InvalidToken"}

        req.user = user
        // console.log(req.user, '<<<req.user')
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = {authentication}