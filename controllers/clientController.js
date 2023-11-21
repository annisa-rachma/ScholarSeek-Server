const {
  User,
  userSchool,
  Thread,
  Comment,
  BookmarkThread,
  sequelize,
  Scholarship,
  Mentoring,
  MentoringSessions, BookmarkScholarship
} = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const cloudinary = require("../utils/cloudinary");
const promisify = require("util.promisify");
const { Op } = require("sequelize");
const { formatDate, formatTime } = require("../helpers/dateFormat");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);

class clientController {
  static async loginUser(req, res, next) {
    try {
      // console.log(req.body);
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
        name : `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profileImg: user.profileImg,
        slug: user.slug
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
      });
      if (!user) throw { name: "NotFound" };
      let result = {
        name : `${user.firstName} ${user.lastName}`,
        profileImg : user.profileImg,
        description : user.description,
        schools : user.userSchools,
        status : user.role == "awardee" ? `Awardee ${user.userSchools[0].scholarship}` : `Student at ${user.userSchools[0].school}`
      }
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllScholarships(req, res, next) {
    try {
      // console.log(req.query)
      const page =
        req.query.page && !isNaN(req.query.page) ? +req.query.page : 1;
      const size =
        req.query.size && !isNaN(req.query.size) ? +req.query.size : 8;

      const option = {
        offset: (page - 1) * size,
        limit: size,
        where: {},
        order: [["id", "ASC"]],
        attributes: {
          exclude: [
            "description",
            "links",
            "gpaRequirement",
            "isOpen",
            "university",
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

  static async getScholarshipsById(req, res, next) {
    try {
      // console.log(req.params.slug);
      const data = await Scholarship.findOne({
        where: { slug: req.params.slug },
      });
      // console.log(data);
      if (!data)
        throw {
          name: "NotFound",
        };

      const result = {
        name: data.name,
        isFullyFunded: data.isFullyFunded,
        degrees: data.degrees,
        countries: data.countries,
        countryCode: data.countryCode,
        registrationOpen: data.registrationOpen,
        registrationDeadline: data.registrationDeadline,
        Detail: {
          About: [
            { Description: data.description },
            { University: data.university },
            { Major: data.major },
            { Benefit: data.benefit },
          ],
          Requirement: [
            {
              Age: data.ageRequirement,
            },
            { GPA: data.gpaRequirement },
            { "English Test": data.englishTest },
            { Documents: data.documents },
            { "Other Language Test": data.otherLangTest },
            { "Standarized Test": data.standarizedTest },
          ],
        },
      };
      res.status(200).json(result);
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
            exclude: [
              "updatedAt",
              "createdAt",
              "UserId",
              "ThreadId",
              "like",
              "dislike",
              "content",
            ],
          },
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
      res.status(200).json({ total: threads.length, threads });
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
      const { threadsId } = req.params;
      await Comment.create({
        ...req.body,
        UserId: req.user.id,
        ThreadId: threadsId,
      });
      res.status(201).json({ message: `Successfully added new comment` });
    } catch (err) {
      next(err);
    }
  }

  static async postBookmarkThreads(req, res, next) {
    try {
      // console.log('<<<masuk')
      const { threadsId } = req.params;
      // console.log(req.params.threadsId)
      await BookmarkThread.create({ UserId: req.user.id, ThreadId: threadsId });
      res
        .status(201)
        .json({ message: `Successfully added thread to bookmark` });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }

  static async getAllBookmarkThreads(req, res, next) {
    try {
      const bookmarkThreads = await BookmarkThread.findAll({ 
        where: { UserId: req.user.id },
        order: [["id"]] 
      });
      res.status(200).json(bookmarkThreads);
    } catch (err) {
      next(err);
    }
  }

  static async postMentoring(req, res, next) {
    try {

      await Mentoring.create({ ...req.body, CreatorId: req.user.id });
      res.status(201).json({ message: `Successfully added new Mentoring Session` });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }
  
  // getAllMentoring
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
              }
            ],
          }
        ],
      }
      if (req.query.title)
        option.where = {
          title: {
            [Op.iLike]: `%${req.query.title}%`,
          },
        };
      let { count, rows } = await Mentoring.findAndCountAll(option);
      // const mentoring = await Mentoring.findAll();
      rows = rows.map((el)=> {
        return {
          slug : el.slug,
          imageUrl : el.imageUrl,
          schedule : formatDate(el.schedule),
          hour : el.hour,
          title : el.title,
          name : `${el.User.firstName} ${el.User.lastName}`,
          profileImg : el.User.profileImg,
          status : `Awardee ${el.User.userSchools[0].scholarship}`
        }
      })
      res.status(200).json({ mentoring: rows, totalMentoring: count });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }

  // getMentoringById
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
              }
            ],
          }, {
            model : MentoringSessions, 
            attributes : {
              exclude : [
                "createdAt",
                  "updatedAt",
              ]
            },
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
                  "firstName",
                  "lastName",
                  "slug",
                  "role"
                  ],
                },
              }
            ]
          }
        ],
      });
      let atendeesImage = mentoring.MentoringSessions.map((el) => {
        return el.User.profileImg
      })
      if(atendeesImage.length>4) {
        atendeesImage.slice(0, 4)
      }

      let atendees = mentoring.MentoringSessions.map((el) => {
        return el.User.id
      })
      // console.log(atendees)
      
      let result = {
        title : mentoring.title,
        date : formatDate(mentoring.schedule),
        time : mentoring.hour,
        imageUrl : mentoring.imageUrl,
        profilePicture : mentoring.User.profileImg,
        username : `${mentoring.User.firstName} ${mentoring.User.lastName}`,
        status : `Awardee ${mentoring.User.userSchools[0].scholarship}`,
        topics : mentoring.topik,
        totalAtendees : mentoring.MentoringSessions.length,
        atendeesImage : atendeesImage,
        atendees : atendees,
        slug : mentoring.slug
      }
      res.status(200).json(result);
    } catch (err) {
      console.log(err)
      next(err);
    }
  }

  // postBookmarkMentoring
  static async postBookmarkMentoring(req, res, next) {
    try {
      // console.log('<<<masuk')
      const { slug } = req.params;
      // console.log(req.params.threadsId)
      const mentoring = await Mentoring.findOne({
        where: { slug }
      });

      const bookmarkMentoring = await MentoringSessions.findAll({ 
        where: { UserId: req.user.id, MentoringId : mentoring.id},
        order: [["id"]] 
      });
      // console.log(mentoring.id, '<<< mentoring')
      console.log(bookmarkMentoring.length, "<<<<")
      // if(bookmarkMentoring[0].MentoringId == mentoring.id) {
      //   return res.status(400).json({message: "already booked this session"})
      // }
      if(bookmarkMentoring.length == 0) {
        await MentoringSessions.create({ UserId: req.user.id, MentoringId: mentoring.id });

      } else {
        return res.status(400).json({message: "already booked this session"})

      }
      // console.log(mentoring[0].id, '<<<<<')
      // console.log(mentoring.dataValues.id, "<<<<<")
      res
        .status(201)
        .json({ message: `Successfully join mentoring session` });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }

  // getAllBookmarkMentoring
  static async getAllBookmarkMentoring(req, res, next) {
    try {
      const bookmarkMentoring = await MentoringSessions.findAll({ 
        where: { UserId: req.user.id },
        order: [["id"]] ,
        include : [
          {
            model : Mentoring,
            include: [
              {
                model: User,
                include: [
                  {
                    model: userSchool,
                  }
                ],
              }
            ],
          }
        ]
      });
      let result = bookmarkMentoring.map((el)=> {
        return {
          slug : el.Mentoring.slug,
          imageUrl : el.Mentoring.imageUrl,
          schedule : formatDate(el.Mentoring.schedule),
          hour : el.Mentoring.hour,
          title : el.Mentoring.title,
          name : `${el.Mentoring.User.firstName} ${el.Mentoring.User.lastName}`,
          profileImg : el.Mentoring.User.profileImg,
          status : `Awardee ${el.Mentoring.User.userSchools[0].scholarship}`
        }
      })
      
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  // postBookmarkScholarship
  static async postBookmarkScholarship(req, res, next) {
    try {
      // const { slug } = req.params;
      const data = await Scholarship.findOne({
        where: { slug: req.params.slug },
      });
      // console.log(data, "<<<")
      await BookmarkScholarship.create({ UserId: req.user.id, ScholarshipId: data.id });
      res
        .status(201)
        .json({ message: `Successfully added scholarship to bookmark` });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }

  // getAllBookmarkScholarship
  static async getAllBookmarkScholarship(req, res, next) {
    try {
      const bookmarkScholarship = await BookmarkScholarship.findAll({ 
        where: { UserId: req.user.id },
        include : [
          {
            model : Scholarship
          }
        ],
        order: [["id"]] 
      });
      let result = bookmarkScholarship.map((el) => {
        return {
          isFullyFunded : el.Scholarship.isFullyFunded,
          name : el.Scholarship.name,
          slug : el.Scholarship.slug,
          registrationOpen : el.Scholarship.registrationOpen,
          registrationDeadline : el.Scholarship.registrationDeadline,
          degrees : el.Scholarship.degrees,
          countries : el.Scholarship.countries,
          countryCode : el.Scholarship.countryCode,
        }
      })
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = clientController;
