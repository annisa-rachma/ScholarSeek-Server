const { Mentoring, User, userSchool, MentoringSessions, sequelize } = require("../models")
const formatDate = require("../helpers/formatDate")
const { Op } = require("sequelize")
const cloudinary = require("../utils/cloudinary")
const promisify = require("util.promisify")
const cloudinaryUpload = promisify(cloudinary.uploader.upload)
module.exports = class MentoringController {
    static async getAllMentoring(req, res, next) {
        try {
            let option = {
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "email",
                                "linkedinUrl",
                                "description",
                                "isAwardeeValidate",
                            ],
                        },
                        include: [
                            {
                                model: userSchool,
                            },
                        ],
                    },
                ],
            }
            if (req.query.title)
                option.where = {
                    title: {
                        [Op.iLike]: `%${req.query.title}%`,
                    },
                }
            let { count, rows } = await Mentoring.findAndCountAll(option)
            // const mentoring = await Mentoring.findAll();
            rows = rows.map((el) => {
                return {
                    slug: el.slug,
                    imageUrl: el.imageUrl,
                    schedule: formatDate(el.schedule),
                    hour: el.hour,
                    title: el.title,
                    name: `${el.User.firstName} ${el.User.lastName}`,
                    profileImg: el.User.profileImg,
                    status: `Awardee ${el.User.userSchools[0].scholarship}`,
                }
            })
            res.status(200).json({ datas: rows, totalData: count })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async getMentoringById(req, res, next) {
        try {
            const mentoring = await Mentoring.findOne({
                where: { slug: req.params.slug },
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "email",
                                "linkedinUrl",
                                "description",
                                "isAwardeeValidate",
                            ],
                        },
                        include: [
                            {
                                model: userSchool,
                            },
                        ],
                    },
                    {
                        model: MentoringSessions,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [
                            {
                                model: User,
                                attributes: {
                                    exclude: [
                                        "createdAt",
                                        "updatedAt",
                                        "password",
                                        "email",
                                        "linkedinUrl",
                                        "description",
                                        "isAwardeeValidate",
                                        "firstName",
                                        "lastName",
                                        "slug",
                                        "role",
                                    ],
                                },
                            },
                        ],
                    },
                ],
            })
            let atendeesImage = mentoring.MentoringSessions.map((el) => {
                return el.User.profileImg
            })
            if (atendeesImage.length > 4) {
                atendeesImage.slice(0, 4)
            }

            let atendees = mentoring.MentoringSessions.map((el) => {
                return el.User.id
            })
            // console.log(atendees)

            // console.log(mentoring)
            let result = {
                title: mentoring.title,
                CreatorId: mentoring.CreatorId,
                date: formatDate(mentoring.schedule),
                time: mentoring.hour,
                imageUrl: mentoring.imageUrl,
                profilePicture: mentoring.User.profileImg,
                username: `${mentoring.User.firstName} ${mentoring.User.lastName}`,
                status: `Awardee ${mentoring.User.userSchools[0].scholarship}`,
                topics: mentoring.topik,
                totalAtendees: mentoring.MentoringSessions.length,
                atendeesImage: atendeesImage,
                atendees: atendees,
                slug: mentoring.slug,
                mentoringStatus : mentoring.status,
                quota : mentoring.quota
            }
            res.status(200).json(result)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async postMentoring(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const{title, description,schedule, hour, quota, topik} = req.body
            // imageUrl
            let bannerImage = ""

            try {
                const result = await cloudinaryUpload(req.file.path, {
                    transaction: t,
                })
                bannerImage = result.url
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: "Error",
                })
            }

            if (bannerImage == "") {
                bannerImage = "https://i.pinimg.com/564x/5c/22/37/5c2237f4360dadbcdae3887711877963.jpg"
            }

            const mentoring = await Mentoring.create({ ...req.body, imageUrl: bannerImage ,CreatorId: req.user.id },  { transaction: t })

            await MentoringSessions.create({UserId: req.user.id, MentoringId: mentoring.id}, { transaction: t })

            t.commit()
            res.status(201).json({
                message: `Successfully added new Mentoring Session`,
            })
        } catch (err) {
            console.log(err)
            t.rollback()
            next(err)
        }
    }

    static async editStatusMentoring(req, res, next) {
        try {
            const mentoring = await Mentoring.update({ status: 'ongoing' }, {where : {slug: req.params.slug }})
            res.status(201).json({
                message: `Successfully updated mentoring status`
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    // toggle
}
