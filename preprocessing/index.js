const fs = require("fs");
const { stringify } = require("querystring");
let keyDel = {}
const data = JSON.parse(fs.readFileSync("./datas/raw/rawData.json", "utf-8")).scholarships.map((el) => el)

// Screening Data yang diperlukan saja
for (const iterator of data) {
    for (const key in iterator) {
        if (!keyDel[key] && key != "id" && key != "name" && key != "slug" && key != "gpa_minimum" && key != "gpa_scale_4" && key != "gpa_scale_100" && key != "is_gpa_special" && key != "funding_type" && key != "degrees" && key != "age_minimum" && key != "age_maximum" && key != "benefit" && key != "registration_date" && key != "deadline_date" && key != "links" && key != "documents" && key != "countries" && key != "status" && key != "majors" && key != "universities" && key != "categories") {
            keyDel[key] = 1
        }
    }
}
let s_id = 1
const database = data.map((el)=>{
    for (const key in keyDel) {
        delete el[key]
    }
    el[el.id] = s_id
    s_id++
    return el
})
const writeData = JSON.stringify(database)
// fs.writeFileSync("./datas/raw/data.json", writeData)

// Slicing only scholarships
const cleanData = JSON.parse(fs.readFileSync("./datas/raw/data.json", "utf-8")).map((el) => {
    for (const key in el) {
        if (typeof el[key] == "object") {
            delete el[key];
        }
    }
    return el
})

const writeScholarships = JSON.stringify(cleanData)
// fs.writeFileSync("./datas/scholarships.json", writeScholarships)


// Slicing Table
let dataFundingType = []
let dataDegrees = []
let dataLinks = []
let dataDocuments = []
let dataCountries = []
let dataMajors = []
let dataUniversities = []
let dataCategories = []
let dataTests = []
const dataScholar = JSON.parse(fs.readFileSync("./datas/raw/data.json", "utf-8"))
let i = 1
for (const iterator of dataScholar) {
    let temp = { scholarships_id: iterator[iterator.id] }
    iterator.funding_type.map((el) => {
        temp.name = el
        dataFundingType.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.degrees.map((el) => {
        temp.name = el
        dataDegrees.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.links.map((el) => {
        temp.url = el.link
        dataLinks.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.documents.map((el) => {
        temp.name = el.name
        dataDocuments.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.countries.map((el) => {
        temp.name = el.name
        dataCountries.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.majors.map((el) => {
        temp.name = el.name
        dataMajors.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.universities.map((el) => {
        temp.name = el.name
        dataUniversities.push(temp)
    })
    temp = { scholarships_id: iterator[iterator.id] }
    iterator.categories.map((el) => {
        temp = { scholarships_id: iterator[iterator.id] }
        temp.pk_id = i
        temp.name = el.name
        temp.required = el.required_type
        if (el.tests == null) {
            let tempTest = {}
            tempTest.category_id = temp.pk_id
            tempTest.name = null
            tempTest.min_score = null
            dataTests.push(tempTest)
        } else {
            for (const test of el.tests) {
                let tempTest = {}
                tempTest.category_id = temp.pk_id
                tempTest.name = test.name
                tempTest.min_score = test.minimum_score
                dataTests.push(tempTest)
            }
        }
        // delete temp.pk_id
        dataCategories.push(temp)
        i++
    })
}
dataFundingType = JSON.stringify(dataFundingType)
// fs.writeFileSync("./datas/fundingType.json", dataFundingType)
dataDegrees = JSON.stringify(dataDegrees)
// fs.writeFileSync("./datas/degrees.json", dataDegrees)
dataLinks = JSON.stringify(dataLinks)
// fs.writeFileSync("./datas/links.json", dataLinks)
dataDocuments = JSON.stringify(dataDocuments)
// fs.writeFileSync("./datas/documents.json", dataDocuments)
dataCountries = JSON.stringify(dataCountries)
// fs.writeFileSync("./datas/countries.json", dataCountries)
dataMajors = JSON.stringify(dataMajors)
// fs.writeFileSync("./datas/majors.json", dataMajors)
dataUniversities = JSON.stringify(dataUniversities)
// fs.writeFileSync("./datas/universities.json", dataUniversities)
dataCategories = JSON.stringify(dataCategories)
// fs.writeFileSync("./datas/categories.json", dataCategories)
dataTests = JSON.stringify(dataTests)
// fs.writeFileSync("./datas/tests.json", dataTests)

const tableFundingType = JSON.parse(fs.readFileSync("./datas/fundingType.json", "utf-8"))
const tableDegrees = JSON.parse(fs.readFileSync("./datas/degrees.json", "utf-8"))
const tableLinks = JSON.parse(fs.readFileSync("./datas/links.json", "utf-8"))
const tableDocuments = JSON.parse(fs.readFileSync("./datas/documents.json", "utf-8"))
const tableCountries = JSON.parse(fs.readFileSync("./datas/countries.json", "utf-8"))
const tableMajors = JSON.parse(fs.readFileSync("./datas/majors.json", "utf-8"))
const tableUniversities = JSON.parse(fs.readFileSync("./datas/universities.json", "utf-8"))
const tableCategories = JSON.parse(fs.readFileSync("./datas/categories.json", "utf-8"))
const tableTests = JSON.parse(fs.readFileSync("./datas/tests.json", "utf-8"))

let tempObj = {}
for (const iterator of tableUniversities) {
    if (!tempObj[iterator.name]) {
        tempObj[iterator.name] = 1
    } else {
        tempObj[iterator.name]++
    }
}
console.log(tempObj);

// command for migrate
// npx sequelize-cli model:generate --name Scholarship --attributes name:string,slug:string,gpa_scale_4:integer,gpa_scale_100:integer,is_gpa_special:boolean,age_minimum:integer,age_maximum:integer,benefit:string,registration_date:dateonly,deadline_date:dateonly,status:string

// npx sequelize-cli model:generate --name FundingType --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name Degree --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name Link --attributes scholarships_id:integer,url:string

// npx sequelize-cli model:generate --name Document --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name Country --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name Major --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name University --attributes scholarships_id:integer,name:string

// npx sequelize-cli model:generate --name Category --attributes scholarships_id:integer,name:string,required:string

// npx sequelize-cli model:generate --name Test --attributes category_id:integer,name:string,min_score:integer