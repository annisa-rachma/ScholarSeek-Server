const { User, Scholarship } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

class adminController {
  static async loginUser(req, res, next) {
    try {
      console.log(req.body);
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

  static async registerUser(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;
      let profileImg = "https://source.boringavatars.com/beam/40/bryan";

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        profileImg,
        role: "admin",
      });
      res.status(201).json({ message: "succesfully registered" });
    } catch (err) {
      next(err);
    }
  }

  static async getAllUser(req, res, next) {
    try {
      const data = await User.findAll({
        where : {role: ['awardee', 'admin']},
        attributes: [
          "id",
          "firstName",
          "lastName",
          "username",
          "email",
          "role",
          "isAwardeeValidate",
        ],
      });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async patchIsValidateUser(req, res, next) {
    try {
      console.log(11111);
      console.log(req.body,111111);
      const { isAwardeeValidate } = req.body;
      const user = await User.findByPk(req.params.id);
      if (!user) throw { name: "NotFound" };
      const data = await User.update(
        { isAwardeeValidate },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );
      res.status(200).json({ message: `User id ${user.id} has been updated` });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllScholarships(req, res, next) {
    try {
      // const page =
      //   req.query.page && !isNaN(req.query.page) ? +req.query.page : 1;
      // const size =
      //   req.query.size && !isNaN(req.query.size) ? +req.query.size : 5;

      const option = {
        // offset: (page - 1) * size,
        // limit: size,
        where: {},
        order: [["id", "ASC"]],
        attributes: {
          exclude: [
            "description",
            "links",
            "gpaRequirement",
            // "isOpen",
            // "university",
            "ageRequirement",
            "major",
            "benefit",
            "englishTest",
            "otherLangTest",
            "standarizedTest",
            "documents",
            "others",
          ],
        },
      };

      if (req.query.name)
        option.where = {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        };
      if (
        req.query.isFullyFunded !== undefined &&
        req.query.isFullyFunded !== ""
      ) {
        const isFullyFunded = req.query.isFullyFunded === "true";
        option.where.isFullyFunded = isFullyFunded;
      }
      if (req.query.degrees) {
        const degreesArray = req.query.degrees
          .split(",")
          .filter((degree) => degree.trim() !== "");
        if (degreesArray.length > 0) {
          option.where.degrees = {
            [Op.contains]: degreesArray,
            // [Op.overlap]: degreesArray
          };
        }
      }
      if (req.query.university) {
        const universityArray = req.query.university
          .split(",")
          .filter((university) => university.trim() !== "");
        if (universityArray.length > 0) {
          option.where.university = {
            [Op.contains]: universityArray,
            // [Op.overlap]: universityArray
          };
        }
      }
      if (req.query.countries) {
        const countriesArray = req.query.countries
          .split(",")
          .filter((country) => country.trim() !== "");
        if (countriesArray.length > 0) {
          option.where.countries = {
            [Op.contains]: countriesArray,
            // [Op.overlap]: countriesArray
          };
        }
      }
      // console.log(option, "INI OPTIONNYA BOSS");

      const { count, rows } = await Scholarship.findAndCountAll(option);

      //   const totalPage = Math.ceil(count / size);
      // console.log(req.query.isFullyFunded = Boolean, '<<<<<<<');
      //   console.log(rows, count, "<<<");
      res.status(200).json({ scholarships: rows, totalScholarships: count });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async postScholarships(req, res, next) {
    try {
      const booleanFields = ["isFullyFunded"];
      const currentDate = new Date();
      const registrationDeadline = new Date(req.body.registrationDeadline);
      const isOpen = registrationDeadline >= currentDate;
      const data = {};
      const fields = [
        "university",
        "major",
        "benefit",
        "englishTest",
        "otherLangTest",
        "standarizedTest",
        "documents",
        "others",
        "degrees",
        "countries",
      ];
      fields.forEach((field) => {
        if (typeof req.body[field] === "string") {
          data[field] = [req.body[field]];
        } else if (Array.isArray(req.body[field])) {
          data[field] = req.body[field];
        }
      });
      booleanFields.forEach((field) => {
        data[field] = req.body[field] === "Fully Funded";
      });
      console.log(req.body);
      const scholarshipData = await Scholarship.create({
        ...req.body,
        ...data,
        isOpen,
        // userId: req.user.id,
      });

      res.status(201).json(scholarshipData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getScholarshipsById(req, res, next) {
    try {
      console.log(req.params.slug);
      const data = await Scholarship.findOne({
        where: { slug: req.params.slug },
      });
      console.log(data);
      if (!data)
        throw {
          name: "NotFound",
        };

      // const result = {
      //   name: data.name,
      //   isFullyFunded: data.isFullyFunded,
      //   degrees: data.degrees,
      //   countries: data.countries,
      //   registrationOpen: data.registrationOpen,
      //   registrationDeadline: data.registrationDeadline,
      //   description: data.description,
      //   Detail: {
      //     About: [
      //       { Description: data.description },
      //       { University: data.university },
      //       { Major: data.major },
      //       { Benefit: data.benefit },
      //     ],
      //     Requirement: [
      //       {
      //         Age: data.ageRequirement,
      //       },
      //       { GPA: data.gpaRequirement },
      //       { "English Test": data.englishTest },
      //       { Documents: data.documents },
      //       { "Other Language Test": data.otherLangTest },
      //       { "Standarized Test": data.standarizedTest },
      //     ],
      //   },
      // };
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async putScholarshipsById(req, res, next) {
    try {
      // console.log(req.params.slug, "ini params <<<<<<<<");
      const scholarship = await Scholarship.findOne({
        where: { slug: req.params.slug },
      });
      if (!scholarship) throw { name: "NotFound" };
      console.log(scholarship, "<<<<<<");
      const booleanFields = ["isFullyFunded"];
      const currentDate = new Date();
      const registrationDeadline = new Date(req.body.registrationDeadline);
      const isOpen = registrationDeadline >= currentDate;
      const data = {};
      const fields = [
        "university",
        "major",
        "benefit",
        "englishTest",
        "otherLangTest",
        "standarizedTest",
        "documents",
        "others",
        "degrees",
        "countries",
      ];
      fields.forEach((field) => {
        if (typeof req.body[field] === "string") {
          data[field] = [req.body[field]];
        } else if (Array.isArray(req.body[field])) {
          data[field] = req.body[field];
        }
      });
      booleanFields.forEach((field) => {
        data[field] = req.body[field] === "Fully Funded";
      });

      const result = await Scholarship.update(
        {
          ...req.body,
          ...data,
          isOpen,
          //   userId: req.user.id,
        },
        {
          where: { slug: req.params.slug },
          individualHooks: true,
        }
      );
      console.log(result);
      res.status(200).json({
        message: `Your Scholarship id ${scholarship.id} has been updated`,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async deleteScholarshipsById(req, res, next) {
    try {
      const data = await Scholarship.findOne({
        where: { slug: req.params.slug },
      });
      await Scholarship.destroy({ where: { slug: req.params.slug } });
      res.status(200).json({ message: `${data.name} success to delete` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = adminController;
