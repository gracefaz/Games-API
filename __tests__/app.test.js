const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/categories", () => {
  test("200: responds with array of category objects on a key of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const { categories } = res.body;
        expect(res.body).toBeInstanceOf(Object);
        expect(categories).toBeInstanceOf(Array);
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with a Not Found message when passed in a wrong endpoint", () => {
    return request(app)
      .get("/api/categorys")
      .expect(404)
      .then((res) => {
        const { message } = res.body;
        expect(message).toBe("Route Not Found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: responds with a single matching review", () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: REVIEW_ID,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
  test("400: responds with a bad request message when the review_id is given as an invalid data type", () => {
    return request(app)
      .get("/api/reviews/grace")
      .expect(400)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe("Bad request: Invalid data type.");
      });
  });
  test("404: responds with does not exist message when the review_id doesn't exist", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe("The review_id does not exist.");
      });
  });
});
