function getPagination(page, size) {
    const sizeQuery = size 
    ? (size <= 0 || isNaN(size)) ? 10 : size
    : 10

    const pageQuery = page 
        ? (page <= 0 || isNaN(page)) ? 1 : page
        : 1

    const offset = (pageQuery - 1) * sizeQuery
    const limit = sizeQuery

    return {offset, limit, pageQuery: Number(pageQuery)}
}

module.exports = getPagination