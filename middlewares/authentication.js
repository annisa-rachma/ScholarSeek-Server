const { verifyToken } = require('../helpers/jwt')
const {User} = require('../models')

const authentication = async (req, res, next) => {
    // console.log(req.headers)
    // console.log(req.headers.access_token, 'INI ACCES TOKEN')
    try {
        const {access_token} = req.headers
        if(!access_token) throw {name : "InvalidToken"}

        const verify = verifyToken(access_token)
        const user = await User.findByPk(verify.id, {
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
        })
        if(!user) throw {name : "InvalidToken"}

        req.user = user
        // console.log(req.user, '<<<req.user')
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = {authentication}