const { Op } = require("sequelize")
const timeAgo = require("../helpers/timeAgo")
const { User, Thread, Comment, Sequelize } = require("../models")
module.exports = class ThreadController {
    static async getAllThreads(req, res, next) {
        const { search, page } = req.query

        let limit
        let offset

        const option = {
            where: { isActive: true },
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
            order: [["createdAt", "DESC"]],
        }

        if (search !== "" && typeof search !== "undefined") {
            option.where.title = { [Op.iLike]: `%${search}%` }
        }

        try {
            const threads = await Thread.findAll(option)
            const datas = threads.map((el) => {
                // el.createdAt = timeAgo(el.createdAt)
                el.timeAgo = timeAgo(el.createdAt)
                return el
            })
            // console.log(datas)
            // console.log(timeAgo(datas[0].createdAt), '<<<')
            res.status(200).json({ datas, totalData: threads.length })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async getThreadsById(req, res, next) {
        try {
            // console.log(req.params.slug, '<<<<')
            const thread = await Thread.findOne({
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
                    },
                    {
                        model: Comment,
                        order: [["createdAt", 'DESC']],
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
                order: [["createdAt", 'DESC']],
            })
            let comments = thread.Comments.map((el) => {
                return {
                    username:el.User.username,
                    profileImg:el.User.profileImg,
                    createdAt: timeAgo(el.createdAt),
                    like : el.like,
                    dislike : el.dislike,
                    content : el.content
                };
            })
            // console.log(comments)
            let obj = {
                title : thread.title,
                slug : thread.slug,
                like : thread.like,
                dislike : thread.dislike,
                content : thread.content,
                createdAt : timeAgo(thread.createdAt),
                username : thread.User.username,
                profileImg : thread.User.profileImg,
                Comments : comments
            }
            res.status(200).json(obj)
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

    static async putLikeThreads(req, res, next) {
        try {
            await Thread.increment('like',{ by: 1 , where : {slug: req.params.slug }})
            res.status(201).json({
                message: `like`
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async putDislikeThreads(req, res, next) {
        try {
            await Thread.increment('dislike',{ by: 1 , where : {slug: req.params.slug }})
            res.status(201).json({
                message: `dislike`
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}