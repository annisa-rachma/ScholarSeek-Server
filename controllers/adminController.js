const {User} = require("../models")
const {comparePassword} = require('../helpers/bcrypt')
const { signToken } = require("../helpers/jwt")

class adminController {
    static async loginUser(req, res, next) {
        try {
            console.log(req.body)
            const {email, password} = req.body
            if(!email || !password) throw { name : "InvalidInput" }

            const user = await User.findOne({where : {email}})
            if(!user) throw {name : "InvalidEmail/Password"}
            
            const isValidPassword = comparePassword(password, user.password)
            if(!isValidPassword) throw {name : "InvalidEmail/Password"}
            
            const access_token = signToken({id:user.id})
            res.status(200).json({access_token, id: user.id, email: user.email, profileImg:user.profileImg});
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async registerUser(req, res, next) {
        try {
            const {firstName, lastName, email, password} = req.body
            const user = await User.create({firstName, lastName, email, password, role : "admin"})
            res.status(201).json({message : "succesfully registered"})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = adminController