import request from "supertest";
import { createApp } from "../src/app.js";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./testDb.js";

const app = createApp();

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("Customer auth", () => {
  test("registers a new user without leaking the password hash", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("jane@example.com");
    expect(res.body.user.password).toBeUndefined();
  });

  test("rejects duplicate email registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Jane", email: "dup@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Jane 2", email: "dup@example.com", password: "password123" });

    expect(res.status).toBe(409);
  });

  test("logs in with correct credentials and rejects a wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Bob", email: "bob@example.com", password: "password123" });

    const good = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "password123" });
    expect(good.status).toBe(200);
    expect(good.headers["set-cookie"]).toBeDefined();

    const bad = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "wrongpassword" });
    expect(bad.status).toBe(401);
  });
});

describe("Vendor auth", () => {
  test("registers a vendor with a geo location and auto-approves", async () => {
    const res = await request(app).post("/api/auth/vendor/register").send({
      shopName: "Test Florist",
      ownerName: "Owner Name",
      email: "vendor@example.com",
      password: "password123",
      address: "Street 1",
      city: "Brussels",
      postalCode: "1000",
      location: { coordinates: [4.35, 50.85] },
    });

    expect(res.status).toBe(201);
    expect(res.body.vendor.status).toBe("approved");
    expect(res.body.vendor.location.coordinates).toEqual([4.35, 50.85]);
  });

  test("rejects registration with an invalid location", async () => {
    const res = await request(app).post("/api/auth/vendor/register").send({
      shopName: "Bad Shop",
      ownerName: "Owner",
      email: "badvendor@example.com",
      password: "password123",
      address: "Street 1",
      city: "Brussels",
      postalCode: "1000",
      location: { coordinates: [4.35] },
    });

    expect(res.status).toBe(422);
  });
});
