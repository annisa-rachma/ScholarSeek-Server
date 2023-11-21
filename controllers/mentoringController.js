const { Mentoring, User, userSchool, MentoringSessions } = require("../models")
const formatDate = require("../helpers/formatDate")
const { Op } = require("sequelize")

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
        try {
            await Mentoring.create({ ...req.body, CreatorId: req.user.id })
            res.status(201).json({
                message: `Successfully added new Mentoring Session`,
            })
        } catch (err) {
            console.log(err)
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
}
