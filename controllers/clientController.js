const {User, userSchool} = require("../models")
const {comparePassword} = require('../helpers/bcrypt')
const { signToken } = require("../helpers/jwt")
class clientController {
    static async loginUser(req, res, next) {
        try {
            // console.log(req.body)
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

    static async registerUserAwardee(req, res, next) {
        try {
            const {firstName, lastName, email, password, profileImg, linkedinUrl, description, school, major, scholarship, year} = req.body
            if(!linkedinUrl) {
                return res.status(400).json({message : "please fill in the linkedin link"})
            }

            await User.create({firstName, lastName, email, password, role: 'awardee', profileImg, linkedinUrl, description})
            
            if(!school || !major || !scholarship || !year) {
                return res.status(400).json({message : "please fill in the input field"})
            }
            await userSchool.create({UserId : user.id, school, major, scholarship, year})

            res.status(201).json({message : "succesfully registered, please wait a few days for our team to validate your mentor application"})
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async registerUserMentee(req, res, next) {
        try {
            const {firstName, lastName, email, password, profileImg, linkedinUrl, description} = req.body
            const user = await User.create({firstName, lastName, email, password, role: 'mentee', profileImg, linkedinUrl, description})
            res.status(201).json({message : "succesfully registered"})
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = clientController