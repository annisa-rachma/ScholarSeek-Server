const { Comment } = require("../models")

module.exports = class CommentContoroller {
    static async postComments(req, res, next) {
        try {
            const { threadsId } = req.params
            await Comment.create({
                ...req.body,
                UserId: req.user.id,
                ThreadId: threadsId,
            })
            res.status(201).json({ message: `Successfully added new comment` })
        } catch (err) {
            next(err)
        }
    }
}
