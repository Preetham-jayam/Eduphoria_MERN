const assert = require("assert");
const request = require("supertest");
const app = require("../app");


describe("GET /", function () {
    it('should return "API is running"', function (done) {
      request(app)
        .get("/")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          assert.strictEqual(res.text, "API is running");
          done();
        });
    });
  });

describe("GET /api/admin/pending-teachers", () => {
  it("should return pending teachers with authentication", (done) => {
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM5ZGQwZmRiNmU0OTgyYTk2YzZkYjQiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTcxNDIxMTY3MCwiZXhwIjoxNzE0Mjk4MDcwfQ.h888MJDd1bOtJ1svhwrGLqRvKWVzJq7t80ZE-MSgg_c";

    request(app)
      .get("/api/admin/pending-teachers")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        assert(res.body.success, true, "Success should be true");
        assert(res.body.message, "Pending Teachers retrieved successfully", "Message should be 'Pending Teachers retrieved successfully'");
        assert(Array.isArray(res.body.teachers), "Teachers should be an array");
        done();
      })
      .catch((err) => done(err));
  }).timeout(15000);
});
