const { Scholarship } = require("../models");
const { Op } = require("sequelize");

class adminController {
  static async getAllScholarships(req, res, next) {
    try {
      const page = req.query.page && !isNaN(req.query.page) ? +req.query.page : 1;
      const size = req.query.size && !isNaN(req.query.size) ? +req.query.size : 5;

      const option = {
        offset: (page - 1) * size,
        limit: size,
        where: {},
        order: [["id", "ASC"]],
      };

      if (req.query.name)
        option.where = {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        };
        if (req.query.isFullyFunded !== undefined && req.query.isFullyFunded !== '') {
            const isFullyFunded = req.query.isFullyFunded === "true"; 
            option.where.isFullyFunded = isFullyFunded;
        }
        if (req.query.degrees) {
            const degreesArray = req.query.degrees.split(',').filter(degree => degree.trim() !== '');
            if (degreesArray.length > 0) {
                option.where.degrees = {
                    [Op.contains]: degreesArray,
                    // [Op.overlap]: degreesArray  
                };
            }
        }
        if (req.query.university) {
            const universityArray = req.query.university.split(',').filter(university => university.trim() !== '');
            if (universityArray.length > 0) {
                option.where.university = {
                    [Op.contains]: universityArray,
                    // [Op.overlap]: universityArray
                };
            }
        }
        if (req.query.countries) {
            const countriesArray = req.query.countries.split(',').filter(country => country.trim() !== '');
            if (countriesArray.length > 0) {
                option.where.countries = {
                    [Op.contains]: countriesArray,
                    // [Op.overlap]: countriesArray
                };
            }
        }
        
        const { count, rows } = await Scholarship.findAndCountAll(option);
        const totalPage = Math.ceil(count / size);
        // console.log(req.query.isFullyFunded = Boolean, '<<<<<<<');
    //   console.log(rows, count, "<<<");
      res.status(200).json({ scholarships: rows, totalScholarships: count });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = adminController;
