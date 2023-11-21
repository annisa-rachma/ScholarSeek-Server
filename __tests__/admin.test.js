const request = require("supertest");
const app = require("../app");
const { sequelize } = require('../models');
const { describe, it, expect, test } = require('@jest/globals')
const { authentication } = require("../middlewares/authentication");
const { signToken, verifyToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { Scholarship } = require("../models");

const userTestBerhasil = {
    email: "do@mail.com",
    password: "123456"
}
const userTest2 = {
    email: "",
    password: ""
}
const userTest3 = {
    email: "do@mail.com",
    password: "1234567"
}
const userTest4 = {
    email: "dot@mail.com",
    password: "123456"
}

describe("GET HELLO WORLD", () => {
    test("Hello World!", async () => {
        const admin = await request(app)
            .get("/")

        expect(admin.status).toBe(200)
    })
})
describe("POST /admin/login", () => {
    test("Berhasil login", async () => {
        const admin = await request(app)
            .post("/admin/login")
            .send(userTestBerhasil)

        expect(admin.status).toBe(200)
        // expect(admin.body).toHaveProperty("id", expect.any(Number))
        expect(admin.body).toHaveProperty("access_token", signToken({ id: admin.body.id }))
    })

    test("Tidak input email/password", async () => {
        const admin = await request(app)
            .post("/admin/login")
            .send(userTest2)

        expect(admin.status).toBe(400)
        expect(admin.body).toHaveProperty("message", "Email or Password cannot empty")
    })
    test("Memberikan password yang salah", async () => {
        const admin = await request(app)
            .post("/admin/login")
            .send(userTest3)

        expect(admin.status).toBe(401)
        expect(admin.body).toHaveProperty("message", "Invalid email or password")
    })

    test("Email yang diinput  tidak terdaftar di database", async () => {
        const admin = await request(app)
            .post("/admin/login")
            .send(userTest4)

        expect(admin.status).toBe(401)
        expect(admin.body).toHaveProperty("message", "Invalid email or password")
    })
})

describe("POST /admin/register", () => {
    const registerBerhasil = {
        firstName: "admin3",
        lastName: "admin3",
        email: "admin3@mail.com",
        password: "123456",
        profileImg: "https://xsgames.co/randomusers/avatar.php?g=female"
    }
    const register2 = {
        firstName: "admin4",
        lastName: "admin4",
        email: "admin4@mail.com",
        password: "123456",
        profileImg: "https://xsgames.co/randomusers/avatar.php?g=female"
    }
    test("Berhasil register dan access token valid", async () => {
        const user = await request(app)
            .post("/admin/register")
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")
            .send(registerBerhasil)

        expect(user.status).toBe(201)
        expect(user.body).toHaveProperty("message", "succesfully registered")
    })

    test("No Access Token", async () => {
        const user = await request(app)
            .post("/admin/register")
            .send(register2)

        expect(user.status).toBe(401)
        expect(user.body).toHaveProperty("message", "Invalid Token")
    })

    test("Valid Access Token namun invalid Id", async () => {
        const user = await request(app)
            .post("/admin/register")
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzAwNDY5NjIwfQ.7Js-MBpDwwIMNIdNfQErdVSwmRM_YZAF9kDitDD8Iw0")
            .send(register2)

        expect(user.status).toBe(401)
        expect(user.body).toHaveProperty("message", "Invalid Token")
    })

    test("Invalid access token", async () => {
        const user = await request(app)
            .post("/admin/register")
            .set("access_token", "eyJhbGcOiJIUzI1NiIsInR5cCIkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")
            .send(register2)

        expect(user.status).toBe(401)
        expect(user.body).toHaveProperty("message", "Invalid Token")
    })
    test("Register Sequelize Validation Error / Constraint Error", async () => {
        const user = await request(app)
            .post("/admin/register")
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")
            .send(registerBerhasil)

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "Email already registered")
        expect(user.body).toHaveProperty("message", expect.any(String))
    })
})

describe("GET /admin/scholarships", () => {
    test("Berhasil get semua data scholarships No Query", async () => {
        const scholarships = await request(app)
            .get("/admin/scholarships")
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships).toBeInstanceOf(Array)
        expect(scholarships.body.scholarships.length).toBe(5)
    })
    test("Berhasil get semua data scholarships Query Page+Size", async () => {
        let page, size
        const scholarships = await request(app)
            .get(`/admin/scholarships?page=${page = 2}&size=${size = 3}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body.scholarships[0]).toHaveProperty("id", size + 1)
        expect(scholarships.body.scholarships.length).toBe(size)
    })
    test("Berhasil get semua data scholarships Query Name", async () => {
        let name
        const scholarships = await request(app)
            .get(`/admin/scholarships?name=${name = "mext"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].name.toLowerCase().includes(name)).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query isFullyFunded", async () => {
        let isFullyFunded
        const scholarships = await request(app)
            .get(`/admin/scholarships?isFullyFunded=${isFullyFunded = true}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].isFullyFunded).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query Degrees", async () => {
        let degrees
        const scholarships = await request(app)
            .get(`/admin/scholarships?degrees=${degrees = "S2"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].degrees.includes(degrees)).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query University", async () => {
        let university
        const scholarships = await request(app)
            .get(`/admin/scholarships?university=${university = "APU Ritsumeikan"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].id).toBe(3)
    })
    test("Berhasil get semua data scholarships Query Country", async () => {
        let countries
        const scholarships = await request(app)
            .get(`/admin/scholarships?countries=${countries = "Jepang"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].countries.includes(countries)).toBeTruthy()
    })
    test("Fail get semua data scholarships", async () => {
        jest.spyOn(Scholarship, "findAndCountAll").mockRejectedValue("Error");
        const scholarships = await request(app)
            .get(`/admin/scholarships`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(500)
        expect(scholarships.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("POST /admin/scholarships", () => {
    const inputScholar = {
        name: "Scholarship1",
        slug: "scholarship1",
        isFullyFunded: "Fully Funded",
        registrationOpen: "2023-11-01",
        registrationDeadline: "2023-12-01",
        description: "Ini Description",
        university: ["ITB", "UGM"],
        major: ["Math", "Eng"],
        benefit: ["WLB", "Paycheck"],
        ageRequirement: "35",
        englishTest: ["IELTS (6)", "TOEFL iBT (79)", "TOEFL PBT (550)"],
        otherLangTest: "",
        standarizedTest: "",
        documents: ["Passport", "Application Form", "Graduation Diploma or Certificate", "Recommendation Letters", "Proof of English Proficiency", "Academic Transcript", "Abstracts of thesis", "Study Plan", "ID photo"],
        others: "",
        links: "https://www.berklee.edu/scholarships/berklee-merit-based-scholarships",
        degrees: ["S1", "S2"],
        countries: ["Amerika", "Europe"],
        countryCode: "EU",
        gpaRequirement: "3"
    }
    test("Berhasil Create Scholarship", async () => {
        const scholarships = await request(app)
            .post("/admin/scholarships")
            .send(inputScholar)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(201)
        expect(scholarships.body).toHaveProperty("slug", inputScholar.slug)
        expect(scholarships.body).toBeInstanceOf(Object)
    })
    test("Fail Create Scholarship", async () => {
        jest.spyOn(Scholarship, "create").mockRejectedValue("Error");
        const scholarships = await request(app)
            .post("/admin/scholarships")
            .send(inputScholar)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(500)
        expect(scholarships.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("GET /admin/scholarships/:slug", () => {
    let slug
    test("Berhasil Get Scholarship by slug", async () => {
        const scholarships = await request(app)
            .get(`/admin/scholarships/${slug = "berklee-merit-based-scholarships-summer-may"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("name", "Berklee Merit-Based Scholarships - Summer (May)")
        expect(scholarships.body).toBeInstanceOf(Object)
    })
    test("Fail Get Scholarship by slug", async () => {
        let slug
        const scholarships = await request(app)
            .get(`/admin/scholarships/${slug = "pasti-ga-ada"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(404)
        expect(scholarships.body).toHaveProperty("message", "Lodging not found")
    })
})
describe("PUT /admin/scholarships/:slug", () => {
    const inputScholar = {
        name: "Scholarship1 Edited",
        slug: "scholarship1",
        isFullyFunded: "Fully Funded",
        registrationOpen: "2023-11-01",
        registrationDeadline: "2023-12-01",
        description: "Ini Description",
        university: ["ITB", "UGM"],
        major: ["Math", "Eng"],
        benefit: ["WLB", "Paycheck"],
        ageRequirement: "35",
        englishTest: ["IELTS (6)", "TOEFL iBT (79)", "TOEFL PBT (550)"],
        otherLangTest: "",
        standarizedTest: "",
        documents: ["Passport", "Application Form", "Graduation Diploma or Certificate", "Recommendation Letters", "Proof of English Proficiency", "Academic Transcript", "Abstracts of thesis", "Study Plan", "ID photo"],
        others: "",
        links: "https://www.berklee.edu/scholarships/berklee-merit-based-scholarships",
        degrees: ["S1", "S2"],
        countries: ["Amerika", "Europe"],
        countryCode: "EU",
        gpaRequirement: "3"
    }
    test("Berhasil Update Scholarship", async () => {
        const scholarships = await request(app)
            .put(`/admin/scholarships/${inputScholar.slug}`)
            .send(inputScholar)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(201)
        expect(scholarships.body).toHaveProperty("message", expect.any(String))
    })
    test("Fail Update Scholarship", async () => {
        let slug
        const scholarships = await request(app)
            .put(`/admin/scholarships/${slug = "pasti-tidak-ada"}`)
            .send(inputScholar)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(404)
        expect(scholarships.body).toHaveProperty("message", "Lodging not found")
    })
})

describe("DELETE /admin/scholarships/:slug", () => {
    test("Berhasil Delete Scholarship", async () => {
        let slug
        const scholarships = await request(app)
            .delete(`/admin/scholarships/${slug = "scholarship1-edited"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("message", expect.any(String))
    })
    test("Fail Delete Scholarship", async () => {
        let slug
        const scholarships = await request(app)
            .delete(`/admin/scholarships/${slug = "pasti-tidak-ada"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(404)
        expect(scholarships.body).toHaveProperty("message", "Lodging not found")
    })
})