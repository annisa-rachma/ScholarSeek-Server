class ScholarshipController {
    static async getAllScholarships(req, res, next) {
        const { page, size, name, degrees, isFullyFunded, country } = req.query

        const { offset, limit } = getPagination(page, size)

        const QUERY_OPTION = {
            limit,
            offset,
            attributes: [
                "id",
                "name",
                "slug",
                "isFullyFunded",
                "registrationOpen",
                "registrationDeadline",
                "degrees",
                "countries",
                "countryCode",
                "createdAt",
                "updatedAt",
            ],
            order: [["id", "ASC"]],
        }

        if (name || degrees || isFullyFunded || country) QUERY_OPTION.where = {}

        if (name) QUERY_OPTION.where.name = { [Op.iLike]: `%${name}%` }

        if (isFullyFunded && ["true", "false"].includes(isFullyFunded))
            QUERY_OPTION.where.isFullyFunded = isFullyFunded

        if (degrees) {
            const degreeArr = degrees.split(",")
            if (degreeArr.length)
                QUERY_OPTION.where.degrees = { [Op.contains]: degreeArr }
        }
        try {
            const { count, rows } = await Scholarship.findAndCountAll(
                QUERY_OPTION
            )
            res.status(200).json({ datas: rows, totalData: count })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}