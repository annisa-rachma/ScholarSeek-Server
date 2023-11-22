const { Op } = require("sequelize")
const { User, Thread, Comment, Sequelize } = require("../models")

module.exports = class ThreadController {
    static async getAllThreads(req, res, next) {
        const { search, page } = req.query

        let limit
        let offset

        const option = {
            // where: { isActive: true },
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
                },
                { model: Comment, attributes: [] },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn("COUNT", "Comments.ThreadId"),
                        "commentCount",
                    ],
                ],
                exclude: ["updatedAt"],
            },
            group: ["Comments.ThreadId", "Thread.id", "User.id"],
            order: [["createdAt"]],
        }

        if (search !== "" && typeof search !== "undefined") {
            option.where.title = { [Op.iLike]: `%${search}%` }
        }

        try {
            const threads = await Thread.findAll(option)
            const datas = threads
            // console.log(datas)
            res.status(200).json({ datas, totalData: threads.length })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async getThreadsById(req, res, next) {
        try {
            const thread = await Thread.findOne({
                where: { id: req.params.threadsId },
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
                    },
                    {
                        model: Comment,
                        order: [["createdAt"]],
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
                            },
                        ],
                    },
                ],
                attributes: {
                    exclude: ["updatedAt"],
                },
            })
            res.status(200).json(thread)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async postThreads(req, res, next) {
        try {
            await Thread.create({ ...req.body, UserId: req.user.id })
            res.status(201).json({ message: `Successfully added new thread` })
        } catch (err) {
            next(err)
        }
    }
}
