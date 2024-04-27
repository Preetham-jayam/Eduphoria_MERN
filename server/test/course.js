const assert = require("assert");
const request = require("supertest");
const app = require("../app");

describe("GET /api/courses/:cid", () => {
  it("should return course data for valid course ID", (done) => {
    const validCourseId = "661412d4d9d5b0efd05f3086";
    request(app)
      .get(`/api/courses/${validCourseId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        assert(res.body.course, "Course data should be returned");
        done();
      })
      .catch((err) => done(err));
  }).timeout(10000);

  it("should return 404 for invalid course ID", (done) => {
    const invalidCourseId = "661412d4d9d5b0efd05f3080";
  
    request(app)
      .get(`/api/courses/${invalidCourseId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }).timeout(5000);  
});
