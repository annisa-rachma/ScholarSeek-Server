const request = require("supertest");
const app = require("../app");
const { sequelize } = require('../models');
const { authentication } = require("../middlewares/authentication");
const { signToken, verifyToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { User, Scholarship, Thread, Comment, BookmarkThread } = require("../models");
const { search } = require("../routes");
// jest.setTimeout(30000)
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

describe("POST /client/login", () => {
    test("Berhasil login", async () => {
        const user = await request(app)
            .post("/client/login")
            .send(userTestBerhasil)

        expect(user.status).toBe(200)
        expect(user.body).toHaveProperty("id", expect.any(Number))
        expect(user.body).toHaveProperty("access_token", expect.any(String))
    })

    test("Tidak input email/password", async () => {
        const customer = await request(app)
            .post("/client/login")
            .send(userTest2)

        expect(customer.status).toBe(400)
        expect(customer.body).toHaveProperty("message", "Email or Password cannot empty")
    })
    test("Memberikan password yang salah", async () => {
        const customer = await request(app)
            .post("/client/login")
            .send(userTest3)

        expect(customer.status).toBe(401)
        expect(customer.body).toHaveProperty("message", "Invalid email or password")
    })

    test("Email yang diinput  tidak terdaftar di database", async () => {
        const customer = await request(app)
            .post("/client/login")
            .send(userTest4)

        expect(customer.status).toBe(401)
        expect(customer.body).toHaveProperty("message", "Invalid email or password")
    })
})
describe("POST /client/register/awardee", () => {
    const inputAwardee = {
        firstName: "awardee6",
        lastName: "Dong",
        email: "awardee6@mail.com",
        password: "123456",
        linkedinUrl: "linkedin.com/awardee6",
        description: "Ini awardee6",
        school: "SD",
        major: "Math",
        scholarship: "LPDP",
        year: "2020-2021"
    }
    test("Berhasil CREATE USER AWARDEE", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(201)
        expect(user.body).toHaveProperty("message", "succesfully registered, please wait a few days for our team to validate your mentor application")
    })
    test("NULL linkendinUrl CREATE USER AWARDEE", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            // .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the linkedin link")
    })
    test("NULL school CREATE USER AWARDEE ", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            // .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("NULL major CREATE USER AWARDEE ", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            .field("school", "SD")
            // .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("NULL scholarship CREATE USER AWARDEE ", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            .field("school", "SD")
            .field("major", "Math")
            // .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("NULL year CREATE USER AWARDEE ", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee8")
            .field("lastName", "Dong")
            .field("email", "awardee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee8")
            .field("description", "Ini awardee8")
            .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            // .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("FAIL CLOUDINARY CREATE USER AWARDEE", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .send(inputAwardee)

        expect(user.status).toBe(500)
        expect(user.body).toHaveProperty("success", false)
    })
    test("Berhasil CREATE USER AWARDEE INPUT ARRAY", async () => {
        const user = await request(app)
            .post("/client/register/awardee")
            .field("firstName", "awardee88")
            .field("lastName", "Dong")
            .field("email", "awardee88@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/awardee88")
            .field("description", "Ini awardee88")
            .field("school", ["SD", "SMP"])
            .field("major", ["Math", "Science"])
            .field("scholarship", ["LPDP", "LPDP"])
            .field("year", ["2022", "2023"])
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(201)
        expect(user.body).toHaveProperty("message", "succesfully registered, please wait a few days for our team to validate your mentor application")
    })
})
describe("POST /client/register/mentee", () => {
    const inputAwardee = {
        firstName: "mentee100",
        lastName: "Dong",
        email: "mentee100@mail.com",
        password: "123456",
        linkedinUrl: "linkedin.com/mentee100",
        description: "Ini mentee100",
        school: "SD",
        major: "Math",
        year: "2020-2021"
    }
    test("Berhasil CREATE USER MENTEE", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .field("firstName", "mentee70")
            .field("lastName", "Dong")
            .field("email", "mentee70@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/mentee70")
            .field("description", "Ini mentee70")
            .field("school", "SD")
            .field("major", "Math")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(201)
        expect(user.body).toHaveProperty("message", "succesfully registered")
    })
    test("NULL linkendinUrl CREATE USER MENTEE", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .field("firstName", "mentee8")
            .field("lastName", "Dong")
            .field("email", "mentee8@mail.com")
            .field("password", "123456")
            // .field("linkedinUrl", "linkedin.com/mentee8")
            .field("description", "Ini mentee8")
            .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the linkedin link")
    })
    test("NULL school CREATE USER MENTEE ", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .field("firstName", "mentee8")
            .field("lastName", "Dong")
            .field("email", "mentee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/mentee8")
            .field("description", "Ini mentee8")
            // .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("NULL major CREATE USER MENTEE ", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .field("firstName", "mentee8")
            .field("lastName", "Dong")
            .field("email", "mentee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/mentee8")
            .field("description", "Ini mentee8")
            .field("school", "SD")
            // .field("major", "Math")
            .field("scholarship", "LPDP")
            .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("NULL year CREATE USER MENTEE ", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .field("firstName", "mentee8")
            .field("lastName", "Dong")
            .field("email", "mentee8@mail.com")
            .field("password", "123456")
            .field("linkedinUrl", "linkedin.com/mentee8")
            .field("description", "Ini mentee8")
            .field("school", "SD")
            .field("major", "Math")
            .field("scholarship", "LPDP")
            // .field("year", "2020-2021")
            .attach("image", "C:/Users/Fernando/Downloads/unduh_icon.png")

        expect(user.status).toBe(400)
        expect(user.body).toHaveProperty("message", "please fill in the input field")
    })
    test("FAIL CLOUDINARY CREATE USER MENTEE", async () => {
        const user = await request(app)
            .post("/client/register/mentee")
            .send(inputAwardee)

        expect(user.status).toBe(500)
        expect(user.body).toHaveProperty("success", false)
    })
})



describe("GET /client/scholarships", () => {
    test("Berhasil get semua data scholarships No Query", async () => {
        const scholarships = await request(app)
            .get("/client/scholarships")
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships).toBeInstanceOf(Array)
        expect(scholarships.body.scholarships.length).toBe(8)
    })
    test("Berhasil get semua data scholarships Query Page+Size", async () => {
        let page, size
        const scholarships = await request(app)
            .get(`/client/scholarships?page=${page = 2}&size=${size = 3}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body.scholarships[0]).toHaveProperty("id", size + 1)
        expect(scholarships.body.scholarships.length).toBe(size)
    })
    test("Berhasil get semua data scholarships Query Name", async () => {
        let name
        const scholarships = await request(app)
            .get(`/client/scholarships?name=${name = "mext"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].name.toLowerCase().includes(name)).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query isFullyFunded", async () => {
        let isFullyFunded
        const scholarships = await request(app)
            .get(`/client/scholarships?isFullyFunded=${isFullyFunded = true}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].isFullyFunded).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query Degrees", async () => {
        let degrees
        const scholarships = await request(app)
            .get(`/client/scholarships?degrees=${degrees = "S2"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].degrees.includes(degrees)).toBeTruthy()
    })
    test("Berhasil get semua data scholarships Query University", async () => {
        let university
        const scholarships = await request(app)
            .get(`/client/scholarships?university=${university = "APU Ritsumeikan"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].id).toBe(3)
    })
    test("Berhasil get semua data scholarships Query Country", async () => {
        let countries
        const scholarships = await request(app)
            .get(`/client/scholarships?countries=${countries = "Jepang"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("totalScholarships", scholarships.body.totalScholarships)
        expect(scholarships.body.scholarships[0].countries.includes(countries)).toBeTruthy()
    })
    test("Fail get semua data scholarships", async () => {
        jest.spyOn(Scholarship, "findAndCountAll").mockRejectedValue("Error");
        const scholarships = await request(app)
            .get(`/client/scholarships`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(500)
        expect(scholarships.body).toHaveProperty("message", "Internal Server Error")
    })
})

describe("GET /client/scholarships/:slug", () => {
    let slug
    test("Berhasil Get Scholarship by slug", async () => {
        const scholarships = await request(app)
            .get(`/client/scholarships/${slug = "berklee-merit-based-scholarships-summer-may"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(200)
        expect(scholarships.body).toHaveProperty("name", "Berklee Merit-Based Scholarships - Summer (May)")
        expect(scholarships.body).toBeInstanceOf(Object)
    })
    test("Fail Get Scholarship by slug", async () => {
        let slug
        const scholarships = await request(app)
            .get(`/client/scholarships/${slug = "pasti-ga-ada"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(scholarships.status).toBe(404)
        expect(scholarships.body).toHaveProperty("message", "Lodging not found")
    })
})
describe("GET /client/threads/:threadsId", () => {
    let threadsId
    test("Berhasil GET Thread by Id", async () => {
        const threads = await request(app)
            .get(`/client/threads/${threadsId = 1}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDUzOTU3fQ.T1x_VW6TOc8uy8nTJrUZgnwOi99N8HbRwiGmZ4ISLWQ")

        expect(threads.status).toBe(200)
        expect(threads.body.title.includes("LPDP")).toBeTruthy()
        expect(threads.body).toBeInstanceOf(Object)
    })
    test("Fail GET Thread by Id", async () => {
        jest.spyOn(Thread, "findOne").mockRejectedValue("Error");
        const threads = await request(app)
            .get(`/client/threads/${threadsId = 1}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(500)
        expect(threads.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("GET /client/threads", () => {
    test("Berhasil Get semua threads", async () => {
        const threads = await request(app)
            .get(`/client/threads`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(200)
        expect(threads.body).toHaveProperty("total", expect.any(Number))
        expect(threads.body).toHaveProperty("threads", expect.any(Array))
        expect(threads.body).toBeInstanceOf(Object)
    })
    test("Berhasil Get semua threads query search", async () => {
        let search
        const threads = await request(app)
            .get(`/client/threads?search=${search = "LPDP"}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(200)
        expect(threads.body).toHaveProperty("total", expect.any(Number))
        expect(threads.body).toHaveProperty("threads", expect.any(Array))
        expect(threads.body).toBeInstanceOf(Object)
    })
    test("Fail Get threads", async () => {
        jest.spyOn(Thread, "findAll").mockRejectedValue("Error");
        const threads = await request(app)
            .get(`/client/threads`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(500)
        expect(threads.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("POST /client/threads", () => {
    const inputThreads = {
        "like": 7,
        "dislike": 0,
        "title": "Indonesia Emas 2045",
        "content": "Demi mewujudkan Indonesia Emas, kita ......",
        "isActive": true
    }
    const inputThreads2 = {
        "like": 7,
        "dislike": 0,
        "title": "",
        "content": "Demi mewujudkan Indonesia Emas, kita ......",
        "isActive": true
    }
    test("Berhasil CREATE threads", async () => {
        const threads = await request(app)
            .post(`/client/threads`)
            .send(inputThreads)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(201)
        expect(threads.body).toHaveProperty("message", `Successfully added new thread`)
    })
    test("Fail Validation Sequelize / Constraint CREATE threads", async () => {
        const threads = await request(app)
            .post(`/client/threads`)
            .send(inputThreads2)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(400)
        expect(threads.body).toHaveProperty("message", expect.any(String))
    })
    test("Fail CREATE threads", async () => {
        jest.spyOn(Thread, "create").mockRejectedValue("Error");
        const threads = await request(app)
            .post(`/client/threads`)
            .send(inputThreads)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(500)
        expect(threads.body).toHaveProperty("message", "Internal Server Error")
    })
})

describe("POST /client/threads/:threadsId/comment", () => {
    const inputComment = {
        "like": 7,
        "dislike": 0,
        "content": "Demi mewujudkan Indonesia Emas, kita ......",
    }
    const inputComment2 = {
        "like": 7,
        "dislike": 0,
        "content": "",
    }
    let threadsId
    test("Berhasil CREATE Comment", async () => {
        const threads = await request(app)
            .post(`/client/threads/${threadsId = 1}/comment`)
            .send(inputComment)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(201)
        expect(threads.body).toHaveProperty("message", `Successfully added new comment`)
    })
    test("Fail Validation Sequelize / Constraint CREATE Comment", async () => {
        const threads = await request(app)
            .post(`/client/threads/${threadsId = 1}/comment`)
            .send(inputComment2)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(400)
        expect(threads.body).toHaveProperty("message", expect.any(String))
    })
    test("Fail CREATE Comment", async () => {
        jest.spyOn(Comment, "create").mockRejectedValue("Error");
        const threads = await request(app)
            .post(`/client/threads/${threadsId = 1}/comment`)
            .send(inputComment)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(threads.status).toBe(500)
        expect(threads.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("POST /client/threads/:threadsId/bookmarks", () => {
    let threadsId
    test("Berhasil CREATE Bookmark", async () => {
        const bookmarks = await request(app)
            .post(`/client/threads/${threadsId = 1}/bookmarks`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(bookmarks.status).toBe(201)
        expect(bookmarks.body).toHaveProperty("message", `Successfully added thread to bookmark`)
    })
    test("Fail CREATE Bookmark", async () => {
        jest.spyOn(BookmarkThread, "create").mockRejectedValue("Error");
        const bookmarks = await request(app)
            .post(`/client/threads/${threadsId = 1}/bookmarks`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(bookmarks.status).toBe(500)
        expect(bookmarks.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("GET /client/bookmarks/thread", () => {
    test("Berhasil GET Bookmark Thread", async () => {
        const bookmarkThreads = await request(app)
            .get(`/client/bookmarks/thread`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(bookmarkThreads.status).toBe(200)
        expect(bookmarkThreads.body.every((el) => el.UserId == 5)).toBeTruthy()
        expect(bookmarkThreads.body).toBeInstanceOf(Array)
    })
    test("Fail GET Bookmark Thread", async () => {
        jest.spyOn(BookmarkThread, "findAll").mockRejectedValue("Error");
        const bookmarkThreads = await request(app)
            .get(`/client/bookmarks/thread`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(bookmarkThreads.status).toBe(500)
        expect(bookmarkThreads.body).toHaveProperty("message", "Internal Server Error")
    })
})
describe("GET /client/profile/:userId", () => {
    let userId
    test("Berhasil GET Profile User", async () => {
        const profile = await request(app)
            .get(`/client/profile/${userId = 5}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(profile.status).toBe(200)
        expect(profile.body).toBeInstanceOf(Object)
    })
    test("Invalid ID GET Profile User", async () => {
        const profile = await request(app)
            .get(`/client/profile/${userId = 777}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(profile.status).toBe(404)
        expect(profile.body).toHaveProperty("message", "Lodging not found")
    })
    test("Fail GET Profile User", async () => {
        jest.spyOn(User, "findOne").mockRejectedValue("Error");
        const profile = await request(app)
            .get(`/client/profile/${userId = 5}`)
            .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzAwNDY1NTYyfQ.FD2rXjiQgqfhKpfkmpnoMWjm5ow7QX9n6Fnx12ZdawM")

        expect(profile.status).toBe(500)
        expect(profile.body).toHaveProperty("message", "Internal Server Error")
    })
})

