const request = require("supertest");
const app = require("../app");

describe("POST /login", () => {
  it("should return a token for valid email and password", (done) => {
    Promise.resolve().then(() => {
      import('chai').then(chai => {
        const expect = chai.expect;

        const credentials = {
          email: "krishna@gmail.com",
          password: "krish@123",
        };
        request(app)
          .post("/api/user/login")
          .send(credentials)
          .expect(200)
          .expect("Content-Type", /json/)
          .then((res) => {
            expect(res.body).to.have.property("token");
            expect(res.body).to.have.property("userId");
            expect(res.body).to.have.property("email");
            expect(res.body).to.have.property("role");
            done();
          })
          .catch((err) => done(err));
      }).catch(err => done(err));
    });
  }).timeout(10000);

  it("should return 403 for invalid credentials", (done) => {
    const credentials = {
      email: "ashok@gmail.com",
      password: "ashok@123",
    };
    request(app)
      .post("/api/user/login")
      .send(credentials)
      .expect(403, done);
  }).timeout(5000);

  it("should return 403 for blocked accounts", (done) => {
    const credentials = {
      email: "test@gmail.com",
      password: "test@123",
    };
    request(app)
      .post("/api/user/login")
      .send(credentials)
      .expect(403, done);
  });
});
