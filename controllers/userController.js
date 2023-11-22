const {
    User,
    userSchool,
    BookmarkThread,
    sequelize,
    Scholarship,
    Mentoring,
    MentoringSessions,
    BookmarkScholarship,
} = require("../models")
const cloudinary = require("../utils/cloudinary")
const promisify = require("util.promisify")
const cloudinaryUpload = promisify(cloudinary.uploader.upload)
const formatDate = require("../helpers/formatDate")
const { signToken } = require("../helpers/jwt")
const { comparePassword } = require("../helpers/bcrypt")

module.exports = class UserController {
    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) throw { name: "InvalidInput" }

            const loggedInUser = await User.findOne({
                where: { email },
                attributes: ['password', 'id']
            })
            if (!loggedInUser) throw { name: "InvalidEmail/Password" }

            const isValidPassword = comparePassword(password, loggedInUser.password)
            if (!isValidPassword) throw { name: "InvalidEmail/Password" }

            const access_token = signToken({ id: loggedInUser.id })

            const user = await User.findOne({
                where: { email },
                attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
            })
            res.status(200).json(
                {access_token, user}
            )
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async registerUserAwardee(req, res, next) {
        const t = await sequelize.transaction()

        try {
            // console.log(req.body)
            const {
                firstName,
                lastName,
                email,
                password,
                linkedinUrl,
                description,
                school,
                major,
                scholarship,
                year,
            } = req.body
            let profileImg = ""

            if (!linkedinUrl) {
                return res
                    .status(400)
                    .json({ message: "please fill in the linkedin link" })
            }
            if (!school || !major || !scholarship || !year) {
                return res
                    .status(400)
                    .json({ message: "please fill in the input field" })
            }

            try {
                const result = await cloudinaryUpload(req.file.path, {
                    transaction: t,
                })
                // console.log(result);
                profileImg = result.url
                // console.log(profileImg);
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: "Error",
                })
            }

            if (profileImg == "") {
                profileImg = "https://source.boringavatars.com/beam/40/bryan"
            }

            const user = await User.create(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "awardee",
                    profileImg,
                    linkedinUrl,
                    description,
                },
                { transaction: t }
            )

            // console.log(school);
            if (typeof school == "string") {
                await userSchool.create(
                    { UserId: user.id, school, major, scholarship, year },
                    { transaction: t }
                )
            } else {
                let userSchoolData = []

                for (let i = 0; i < school.length; i++) {
                    userSchoolData.push({
                        UserId: user.id,
                        school: school[i],
                        major: major[i],
                        scholarship: scholarship[i],
                        year: year[i],
                    })
                }
                // console.log(userSchoolData);
                await userSchool.bulkCreate(userSchoolData, { transaction: t })
            }

            t.commit()
            res.status(201).json({
                message:
                    "succesfully registered, please wait a few days for our team to validate your mentor application",
            })
        } catch (err) {
            console.log(err)
            t.rollback()
            next(err)
        }
    }

    static async registerUserMentee(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                school,
                major,
                year,
                linkedinUrl,
                description,
            } = req.body
            //   console.log(req.body)

            let profileImg = ""

            if (!school || !major || !year) {
                return res
                    .status(400)
                    .json({ message: "please fill in the input field" })
            }
            try {
                const result = await cloudinaryUpload(req.file.path, {
                    transaction: t,
                })
                // console.log(result);
                profileImg = result.url
                // console.log(profileImg);
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: "Error",
                })
            }

            if (profileImg == "") {
                profileImg = "https://source.boringavatars.com/beam/40/bryan"
            }

            const user = await User.create(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "mentee",
                    profileImg,
                    linkedinUrl,
                    description,
                },
                { transaction: t }
            )

            await userSchool.create(
                { UserId: user.id, school, major, year },
                { transaction: t }
            )

            t.commit()
            res.status(201).json({ message: "succesfully registered" })
        } catch (err) {
            console.log(err)
            t.rollback()
            next(err)
        }
    }

    static async getProfileById(req, res, next) {
        try {
            const user = await User.findOne({
                where: { slug: req.params.slug },
                include: [
                    {
                        model: userSchool,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                },
            })
            if (!user) throw { name: "NotFound" }
            let result = {
                username: user.username,
                name: `${user.firstName} ${user.lastName}`,
                profileImg: user.profileImg,
                description: user.description,
                schools: user.userSchools,
                status:
                    user.role == "awardee"
                        ? `Awardee ${user.userSchools[0].scholarship}`
                        : `Student at ${user.userSchools[0].school}`,
            }
            res.status(200).json(result)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async getAllBookmarkScholarship(req, res, next) {
        try {
            const bookmarkScholarship = await BookmarkScholarship.findAll({
                where: { UserId: req.user.id },
                include: [
                    {
                        model: Scholarship,
                    },
                ],
                order: [["id"]],
            })
            // console.log(bookmarkScholarship, '<<<< INI RESULTLTLT')

            let result = bookmarkScholarship.map((el) => {
                return {
                    isFullyFunded: el.Scholarship.isFullyFunded,
                    name: el.Scholarship.name,
                    slug: el.Scholarship.slug,
                    registrationOpen: el.Scholarship.registrationOpen,
                    registrationDeadline: el.Scholarship.registrationDeadline,
                    degrees: el.Scholarship.degrees,
                    countries: el.Scholarship.countries,
                    countryCode: el.Scholarship.countryCode,
                }
            })
            // console.log(result, '<<<< INI RESULTLTLT')
            res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    static async getAllBookmarkMentoring(req, res, next) {
        try {
            const bookmarkMentoring = await MentoringSessions.findAll({
                where: { UserId: req.user.id },
                order: [["id"]],
                include: [
                    {
                        model: Mentoring,
                        include: [
                            {
                                model: User,
                                include: [
                                    {
                                        model: userSchool,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            })
            let result = bookmarkMentoring.map((el) => {
                return {
                    slug: el.Mentoring.slug,
                    imageUrl: el.Mentoring.imageUrl,
                    schedule: formatDate(el.Mentoring.schedule),
                    hour: el.Mentoring.hour,
                    title: el.Mentoring.title,
                    name: `${el.Mentoring.User.firstName} ${el.Mentoring.User.lastName}`,
                    profileImg: el.Mentoring.User.profileImg,
                    status: `Awardee ${el.Mentoring.User.userSchools[0].scholarship}`,
                }
            })

            res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    static async getAllBookmarkThreads(req, res, next) {
        try {
            const bookmarkThreads = await BookmarkThread.findAll({
                where: { UserId: req.user.id },
                order: [["id"]],
            })
            res.status(200).json(bookmarkThreads)
        } catch (err) {
            next(err)
        }
    }

    static async postBookmarkScholarship(req, res, next) {
        try {
            // const { slug } = req.params;
            const data = await Scholarship.findOne({
                where: { slug: req.params.slug },
            })
            // console.log(data, "<<<")
            await BookmarkScholarship.create({
                UserId: req.user.id,
                ScholarshipId: data.id,
            })
            res.status(201).json({
                message: `Successfully added scholarship to bookmark`,
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async postBookmarkMentoring(req, res, next) {
        try {
            // console.log('<<<masuk')
            const { slug } = req.params
            // console.log(req.params.threadsId)
            const mentoring = await Mentoring.findOne({
                where: { slug },
            })

            const bookmarkMentoring = await MentoringSessions.findAll({
                where: { UserId: req.user.id, MentoringId: mentoring.id },
                order: [["id"]],
            })
            // console.log(mentoring.id, '<<< mentoring')
            console.log(bookmarkMentoring.length, "<<<<")
            // if(bookmarkMentoring[0].MentoringId == mentoring.id) {
            //   return res.status(400).json({message: "already booked this session"})
            // }
            if (bookmarkMentoring.length == 0) {
                await MentoringSessions.create({
                    UserId: req.user.id,
                    MentoringId: mentoring.id,
                })
            } else {
                return res
                    .status(400)
                    .json({ message: "already booked this session" })
            }
            // console.log(mentoring[0].id, '<<<<<')
            // console.log(mentoring.dataValues.id, "<<<<<")
            res.status(201).json({
                message: `Successfully join mentoring session`,
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async postBookmarkThreads(req, res, next) {
        try {
            // console.log('<<<masuk')
            const { threadsId } = req.params
            // console.log(req.params.threadsId)
            await BookmarkThread.create({
                UserId: req.user.id,
                ThreadId: threadsId,
            })
            res.status(201).json({
                message: `Successfully added thread to bookmark`,
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}
