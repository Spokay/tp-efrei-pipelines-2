jest.mock("mysql2", () => ({
  createPool: () => ({
    getConnection: (cb) => cb(null, { release: () => {} }),
    query: jest.fn(),
  }),
}));

const request = require("supertest");
const app = require("../server");

describe("GET /to_uppercase/:text", () => {
  it("uppercases a lowercase string", async () => {
    const res = await request(app).get("/to_uppercase/hello");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ original: "hello", uppercased: "HELLO" });
  });

  it("returns the same string when already uppercase", async () => {
    const res = await request(app).get("/to_uppercase/HELLO");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ original: "HELLO", uppercased: "HELLO" });
  });

  it("uppercases a mixed-case string", async () => {
    const res = await request(app).get("/to_uppercase/HeLLo");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ original: "HeLLo", uppercased: "HELLO" });
  });

  it("handles a string with numbers and special characters", async () => {
    const res = await request(app).get("/to_uppercase/abc123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ original: "abc123", uppercased: "ABC123" });
  });

  it("handles a single character", async () => {
    const res = await request(app).get("/to_uppercase/a");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ original: "a", uppercased: "A" });
  });
});
