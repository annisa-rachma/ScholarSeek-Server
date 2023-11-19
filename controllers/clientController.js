const { User, userSchool, Thread, Comment, sequelize } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const cloudinary = require("../utils/cloudinary");
const promisify = require("util.promisify");
const { Op } = require("sequelize");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);

class clientController {
  static async loginUser(req, res, next) {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      if (!email || !password) throw { name: "InvalidInput" };

      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: "InvalidEmail/Password" };

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) throw { name: "InvalidEmail/Password" };

      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
        id: user.id,
        email: user.email,
        role: user.role,
        profileImg: user.profileImg,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async registerUserAwardee(req, res, next) {
    const t = await sequelize.transaction();

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
      } = req.body;
      let profileImg = "";

      if (!linkedinUrl) {
        return res
          .status(400)
          .json({ message: "please fill in the linkedin link" });
      }
      if (!school || !major || !scholarship || !year) {
        return res
          .status(400)
          .json({ message: "please fill in the input field" });
      }

      try {
        const result = await cloudinaryUpload(req.file.path, {
          transaction: t,
        });
        // console.log(result);
        profileImg = result.url;
        // console.log(profileImg);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }

      if (profileImg == "") {
        profileImg = "https://source.boringavatars.com/beam/40/bryan";
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
      );

      // console.log(school);
      if (typeof school == "string") {
        await userSchool.create(
          { UserId: user.id, school, major, scholarship, year },
          { transaction: t }
        );
      } else {
        let userSchoolData = [];

        for (let i = 0; i < school.length; i++) {
          userSchoolData.push({
            UserId: user.id,
            school: school[i],
            major: major[i],
            scholarship: scholarship[i],
            year: year[i],
          });
        }
        // console.log(userSchoolData);
        await userSchool.bulkCreate(userSchoolData, { transaction: t });
      }

      t.commit();
      res.status(201).json({
        message:
          "succesfully registered, please wait a few days for our team to validate your mentor application",
      });
    } catch (err) {
      console.log(err);
      t.rollback();
      next(err);
    }
  }

  static async registerUserMentee(req, res, next) {
    const t = await sequelize.transaction();
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
      } = req.body;
      //   console.log(req.body)

      let profileImg = "";

      if (!school || !major || !year) {
        return res
          .status(400)
          .json({ message: "please fill in the input field" });
      }
      try {
        const result = await cloudinaryUpload(req.file.path, {
          transaction: t,
        });
        // console.log(result);
        profileImg = result.url;
        // console.log(profileImg);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }

      if (profileImg == "") {
        profileImg = "https://source.boringavatars.com/beam/40/bryan";
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
      );

      await userSchool.create(
        { UserId: user.id, school, major, year },
        { transaction: t }
      );

      t.commit();
      res.status(201).json({ message: "succesfully registered" });
    } catch (err) {
      console.log(err);
      t.rollback();
      next(err);
    }
  }

  static async getProfileById(req, res, next) {
    try {
      const user = await User.findOne({
        where: { id: req.params.userId },
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
      });
      if (!user) throw { name: "NotFound" };
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllThreads(req, res, next) {
    const { search, page } = req.query;

    let limit;
    let offset;

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
        {
          model: Comment,
          attributes: {
            exclude: ["updatedAt", "createdAt", "UserId", "ThreadId", "like", "dislike", "content"],
          }
        },
      ],
      attributes: {
        exclude: ["updatedAt"],
      },
      order: [["createdAt"]],
    };

    if (search !== "" && typeof search !== "undefined") {
      option.where.title = { [Op.iLike]: `%${search}%` };
    }

    // if (page !== "" && typeof page !== "undefined") {
    //   if (page.size !== "" && typeof page.size !== "undefined") {
    //     limit = page.size;
    //     option.limit = limit;
    //   }

    //   if (page.number !== "" && typeof page.number !== "undefined") {
    //     offset = page.number * limit - limit;
    //     option.offset = offset;
    //   }
    // } else {
    //   limit = 5; // limit 5 item
    //   offset = 0;
    //   option.limit = limit;
    //   option.offset = offset;
    // }

    try {
      const threads = await Thread.findAll(option);
      res.status(200).json({total:threads.length, threads});
    } catch (err) {
      console.log(err);
      next(err);
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
            include : [
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
            ]
          },
        ],
        attributes: {
          exclude: ["updatedAt"],
        },
      });
      res.status(200).json(thread);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postThreads(req, res, next) {
    try {
      await Thread.create({ ...req.body, UserId: req.user.id });
      res.status(201).json({ message: `Successfully added new thread` });
    } catch (err) {
      next(err);
    }
  }

  static async postComments(req, res, next) {
    try {
      const {threadsId} = req.params
      await Comment.create({ ...req.body, UserId: req.user.id,  ThreadId: threadsId});
      res.status(201).json({ message: `Successfully added new comment` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = clientController;
