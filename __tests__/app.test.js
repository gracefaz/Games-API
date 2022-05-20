const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
require("jest-sorted");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("ERROR - Invalid Endpoint", () => {
  test("404 - responds with a not found message when given invalid path", () => {
    return request(app)
      .get("/api/revs")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route Not Found");
      });
  });
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
});

describe("GET /api/reviews/:review_id", () => {
  test("200: responds with a single matching review with comment_count key", () => {
    return request(app)
      .get(`/api/reviews/2`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: "3",
        });
      });
  });
  test("200: responds with a single matching review with comment_count key of zero when no comments exist for review_id", () => {
    return request(app)
      .get(`/api/reviews/4`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          category: "social deduction",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 7,
          comment_count: "0",
        });
      });
  });
  test("400: responds with a bad request message when the review_id is given as an invalid data type", () => {
    return request(app)
      .get("/api/reviews/grace")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
  test("404: responds with does not exist message when the review_id doesn't exist", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("The review_id does not exist.");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("201: responds with the correct updated object", () => {
    return request(app)
      .patch(`/api/reviews/3`)
      .send({ inc_votes: 5 })
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 10,
        });
      });
  });
  test("404: responds with does not exist message when the review_id doesn't exist", () => {
    return request(app)
      .patch(`/api/reviews/99999`)
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("The review_id does not exist.");
      });
  });
  test("400: responds with a bad request message when the review_id is given as an invalid data type", () => {
    return request(app)
      .patch("/api/reviews/grace")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
  test("400: responds with a bad request message when the inc_votes is given as an invalid data type", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
  test("400: responds with a bad request message when the user sends a body that doesn't contain an inc_votes key", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Missing contents.");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array user of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;
        expect(res.body).toBeInstanceOf(Object);
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: responds with an array of review objects (default)", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(res.body).toBeInstanceOf(Object);
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with array of review objects sorted in descending order by votes", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews).toBeSortedBy("votes", { descending: true });
        expect(reviews.length).toBe(13);
      });
  });
  test("400: responds with bad request when passed an invalid sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=something")
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message).toBe("Bad request: Invalid input.");
      });
  });
  test("400: responds with bad request when passed an invalid order", () => {
    return request(app)
      .get("/api/reviews?order=something")
      .expect(400)
      .then((res) => {
        const { message } = res.body;
        expect(message).toBe("Bad request: Invalid input.");
      });
  });
  test("200: responds with array of review objects filtered by category", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(11);
        body.reviews.forEach(({ category }) => {
          expect(category).toBe("social deduction");
        });
      });
  });
  test("404: responds with not found when user passes a non existing category", () => {
    return request(app)
      .get("/api/reviews?category=something")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found: Category does not exist");
      });
  });
  test("400: responds with bad request when user passes a category of the wrong data type", () => {
    return request(app)
      .get("/api/reviews?category=999999")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid input.");
      });
  });
  test("200: responds with an empty array when category exists but has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual([]);
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: responds with an array of comment objects", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(res.body).toBeInstanceOf(Object);
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test("200: responds with an empty array when passed a found review_id, but no comments exist for that review_id", () => {
    return request(app)
      .get(`/api/reviews/1/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("400: responds with a bad request message when the review_id is given as an invalid data type", () => {
    return request(app)
      .get("/api/reviews/grace/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
  test("404: responds with does not exist message when the review_id doesn't exist in the database", () => {
    return request(app)
      .get("/api/reviews/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("The review_id does not exist.");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: responds with added comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire", body: "Farmyard fun!" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 7,
          body: "Farmyard fun!",
          votes: 0,
          author: "mallionaire",
          review_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("400: responds with bad request when body does not contain both mandatory keys", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Missing contents.");
      });
  });
  test("400: responds with bad request when review_id given as invalid data type", () => {
    return request(app)
      .post("/api/reviews/grace/comments")
      .send({ username: "mallionaire", body: "Farmyard fun!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
  test("404: responds with not found when review_id does not exist", () => {
    return request(app)
      .post(`/api/reviews/99999/comments`)
      .send({ username: "mallionaire", body: "Farmyard fun!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("The review_id does not exist.");
      });
  });
  test("404: responds with not found when a user not in the database tries to post", () => {
    return request(app)
      .post(`/api/reviews/1/comments`)
      .send({ username: "grace", body: "some body" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("The username does not exist.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with updated array of objects, the correct object having been deleted", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("404: responds with not found when the comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found: The comment_id does not exist");
      });
  });
  test("400: responds with bad request when the comment_id is an invalid data type", () => {
    return request(app)
      .delete("/api/comments/grace")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: Invalid data type.");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with a json object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(Object.keys(res.body.description).length).toBe(9);
        expect(res.body.description["GET /api"].description).toBe(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});
