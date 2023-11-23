const { Comment, Thread } = require("../models")

module.exports = class CommentContoroller {
    static async postComments(req, res, next) {
        try {
            // const { slug } = req.params
            // console.log(req.body)
            const thread = await Thread.findOne({
                where: { slug: req.params.slug }})
            await Comment.create({
                ...req.body,
                UserId: req.user.id,
                ThreadId: thread.id,
            })
            res.status(201).json({ message: `Successfully added new comment` })
        } catch (err) {
            next(err)
        }
    }
}
