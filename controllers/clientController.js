const { User, userSchool, sequelize } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const cloudinary = require("../utils/cloudinary");
const promisify = require("util.promisify");
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
        const result = await cloudinaryUpload(req.file.path);
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
        }
        // { transaction: t }
      );

      await userSchool.create(
        { UserId: user.id, school, major, scholarship, year }
        // { transaction: t }
      );

      res.status(201).json({
        message:
          "succesfully registered, please wait a few days for our team to validate your mentor application",
      });
    } catch (err) {
      console.log(err);
      //   t.rollback();
      next(err);
    }
  }

  static async registerUserMentee(req, res, next) {
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
        const result = await cloudinaryUpload(req.file.path);
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

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role: "mentee",
        profileImg,
        linkedinUrl,
        description,
      });

      await userSchool.create({ UserId: user.id, school, major, year });

      res.status(201).json({ message: "succesfully registered" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = clientController;
