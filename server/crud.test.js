const request = require("supertest");
const app = require("./app");


describe("GET /", function () {
  test('should return "API is running"', function (done) {
    request(app)
      .get("/")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).toBeDefined();
        done();
      });
  });
});


describe("POST /login", () => {
  test("should return a token for valid email and password", async () => {
    const credentials = {
      email: "krishna@gmail.com",
      password: "krish@123",
    };

    const res = await request(app)
      .post("/api/user/login")
      .send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("role");
  }, 10000);

  test("should return 403 for invalid credentials", async () => {
    const credentials = {
      email: "ashok@gmail.com",
      password: "ashok@123",
    };

    const res = await request(app)
      .post("/api/user/login")
      .send(credentials);

    expect(res.status).toBe(403);
  }, 5000);

  test("should return 403 for blocked accounts", async () => {
    const credentials = {
      email: "test@gmail.com",
      password: "test@123",
    };

    const res = await request(app)
      .post("/api/user/login")
      .send(credentials);

    expect(res.status).toBe(403);
  });
});


describe("GET /api/courses/:cid", () => {
  test("should return course data for valid course ID", (done) => {
    const validCourseId = "661412d4d9d5b0efd05f3086";
    request(app)
      .get(`/api/courses/${validCourseId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.course).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  }, 10000);

  test("should return 404 for invalid course ID", (done) => {
    const invalidCourseId = "661412d4d9d5b0efd05f3080";
  
    request(app)
      .get(`/api/courses/${invalidCourseId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }, 5000);  
});
