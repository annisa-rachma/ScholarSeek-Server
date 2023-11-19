const { User, Scholarship, Category, Country, Degree, Document, FundingType, Link, Major, University, Test } = require("../models")
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require("../helpers/jwt")
const redis = require("../config/redis")
const { filterAndPagination, searchAndOrderBy } = require("../helpers/pagination_filter_search_orderBy")

class adminController {
    static async loginUser(req, res, next) {
        try {
            console.log(req.body)
            const { email, password } = req.body
            if (!email || !password) throw { name: "InvalidInput" }

            const user = await User.findOne({ where: { email } })
            if (!user) throw { name: "InvalidEmail/Password" }

            const isValidPassword = comparePassword(password, user.password)
            if (!isValidPassword) throw { name: "InvalidEmail/Password" }

            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token, id: user.id, email: user.email, profileImg: user.profileImg });
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async registerUser(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body
            let profileImg = "https://source.boringavatars.com/beam/40/bryan";

            const user = await User.create({ firstName, lastName, email, password, profileImg, role: "admin" })
            res.status(201).json({ message: "succesfully registered" })
        } catch (err) {
            next(err)
        }
    }

    static async getAllScholarships(req, res, next) {
        try {
            console.log("Masuk getAllScholarships");
            let { name, orderBy } = req.query
            let data, option
            data = await redis.get("scholarships:all")
            if (!data) {
                const scholarships = await Scholarship.findAll({
                    include: [FundingType, Degree, Link, Document, Country, Major, University,
                        {
                            model: Category,
                            include: [Test]
                        }
                    ],
                    order: [["id", "ASC"]],
                })
                await redis.set("scholarships:all", JSON.stringify(scholarships))
                data = scholarships
            } else if (name || orderBy) {
                option = searchAndOrderBy(req.query)
                const scholarships = await Scholarship.findAll(option)
                data = scholarships
            } else {
                data = JSON.parse(data)
            }
            const result = filterAndPagination(req.query, data)
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    static async getScholarshipsById(req, res, next) {
        try {
            console.log("Masuk getScholarshipsById");
            let { scholarshipId } = req.params
            let result, data, reFetch = false
            data = await redis.get("scholarships:all")
            if (data) {
                console.log("CACHE ADA");
                data = JSON.parse(data)
                result = data.find(el => el.id == scholarshipId)
                result ? reFetch = false : reFetch = true
            }
            if (reFetch) {
                console.log("MASUKREFETCH");
                const scholarship = await Scholarship.findOne({
                    where: { id: scholarshipId },
                    include: [FundingType, Degree, Link, Document, Country, Major, University,
                        {
                            model: Category,
                            include: [Test]
                        }
                    ],
                    order: [["id", "ASC"]],
                })
                result = scholarship
            }
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = adminController
