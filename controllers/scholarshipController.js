const { Scholarship } = require("../models")
const getPagination = require("../helpers/getPagination")
const { Op } = require("sequelize")

module.exports = class ScholarshipController {
    static async getAllScholarships(req, res, next) {
        const { page, size, name, degrees, isFullyFunded, country } = req.query

        const { offset, limit } = getPagination(page, size)

        const QUERY_OPTION = {
            limit,
            offset,
            attributes: [
                "id",
                "name",
                "slug",
                "isFullyFunded",
                "registrationOpen",
                "registrationDeadline",
                "degrees",
                "countries",
                "countryCode",
                "createdAt",
                "updatedAt",
            ],
            order: [["id", "ASC"]],
        }

        if (name || degrees || isFullyFunded || country) QUERY_OPTION.where = {}

        if (name) QUERY_OPTION.where.name = { [Op.iLike]: `%${name}%` }

        if (isFullyFunded && ["true", "false"].includes(isFullyFunded))
            QUERY_OPTION.where.isFullyFunded = isFullyFunded

        if (degrees) {
            const degreeArr = degrees.split(",")
            if (degreeArr.length)
                QUERY_OPTION.where.degrees = { [Op.contains]: degreeArr }
        }
        try {
            const { count, rows } = await Scholarship.findAndCountAll(
                QUERY_OPTION
            )
            res.status(200).json({ datas: rows, totalData: count })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async getScholarshipsById(req, res, next) {
        try {
            // console.log(req.params.slug);
            const data = await Scholarship.findOne({
                where: { slug: req.params.slug },
            })
            // console.log(data);
            if (!data)
                throw {
                    name: "NotFound",
                }

            const result = {
                name: data.name,
                isFullyFunded: data.isFullyFunded,
                degrees: data.degrees,
                countries: data.countries,
                countryCode: data.countryCode,
                registrationOpen: data.registrationOpen,
                registrationDeadline: data.registrationDeadline,
                Detail: {
                    About: [
                        { Description: data.description },
                        { University: data.university },
                        { Major: data.major },
                        { Benefit: data.benefit },
                    ],
                    Requirement: [
                        {
                            Age: data.ageRequirement,
                        },
                        { GPA: data.gpaRequirement },
                        { "English Test": data.englishTest },
                        { Documents: data.documents },
                        { "Other Language Test": data.otherLangTest },
                        { "Standarized Test": data.standarizedTest },
                    ],
                },
            }
            res.status(200).json(result)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}
