const { Op } = require("sequelize");
const { User, Scholarship, Category, Country, Degree, Document, FundingType, Link, Major, University, Test } = require("../models")
function filterAndPagination(query, data) {
    let result = { countData: data.length, data: data }
    let { degree, fundingType, country, page } = query
    console.log(degree, fundingType, country, page, "QUERYFILTER");
    if (country) {
        console.log("MASUK country", country);
        result.data = data.filter((el) => {
            for (const iterator of el.Countries) {
                if (iterator.name == country) {
                    return el
                }
            }
        })
    }
    if (degree && result) {
        console.log("MASUK degree", degree);
        result.data = result.data.filter((el) => {
            for (const iterator of el.Degrees) {
                if (iterator.name == degree) {
                    return el
                }
            }
        })
    }
    if (fundingType && result) {
        console.log("MASUK fundingType", fundingType);
        result.data = result.data.filter((el) => {
            for (const iterator of el.FundingTypes) {
                if (iterator.name == fundingType) {
                    return el
                }
            }
        })
    }
    result.countData = result.data.length
    const limit = 5
    let start, end
    if (!page) {
        page = 0
        start = 0
        end = limit
    } else {
        start = limit * page - 1
        end = limit * page + limit
    }
    console.log(start, end, "STARTEND");
    result.data = result.data.slice(start, end)
    return result
}

function searchAndOrderBy(query) {
    let { name, orderBy } = query
    let option
    console.log(name, orderBy, "SEARCHANDORDERBY");
    if (orderBy == "ASC") {
        orderBy = ['deadline_date', "ASC"]
    } else if (orderBy == "DESC") {
        orderBy = ['deadline_date', "DESC"]
    }
    if (name && orderBy) {
        console.log("MASUKNAMEDANORDERBY");
        option = {
            include: [FundingType, Degree, Link, Document, Country, Major, University,
                {
                    model: Category,
                    include: [Test]
                }
            ],
            order: [orderBy],
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        }
    } else if (orderBy) {
        console.log("MASUKORDERBY");
        option = {
            include: [FundingType, Degree, Link, Document, Country, Major, University,
                {
                    model: Category,
                    include: [Test]
                }
            ],
            order: [orderBy]
        }
    } else if (name) {
        console.log("MASUKNAME");
        option = {
            include: [FundingType, Degree, Link, Document, Country, Major, University,
                {
                    model: Category,
                    include: [Test]
                }
            ],
            order: [["id", "ASC"]],
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        }
    }

    return option
}


module.exports = { filterAndPagination, searchAndOrderBy }