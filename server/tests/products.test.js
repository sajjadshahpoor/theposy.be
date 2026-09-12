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

async function registerVendor(agent, suffix) {
  return agent.post("/api/auth/vendor/register").send({
    shopName: `Shop ${suffix}`,
    ownerName: "Owner",
    email: `vendor${suffix}@example.com`,
    password: "password123",
    address: "Street 1",
    city: "Brussels",
    postalCode: "1000",
    location: { coordinates: [4.35, 50.85] },
  });
}

describe("Product catalog", () => {
  test("a vendor can create a product and it appears in the public listing", async () => {
    const agent = request.agent(app);
    await registerVendor(agent, "a");

    const createRes = await agent
      .post("/api/products")
      .field("title", "Rose Bouquet")
      .field("priceCents", "3000")
      .field("quantity", "5");
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get("/api/products");
    expect(listRes.status).toBe(200);
    expect(listRes.body.items).toHaveLength(1);
    expect(listRes.body.items[0].title).toBe("Rose Bouquet");
  });

  test("unauthenticated requests cannot create products", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("title", "Unauthorized Bouquet")
      .field("priceCents", "1000");
    expect(res.status).toBe(401);
  });

  test("a vendor cannot update or delete another vendor's product", async () => {
    const agentA = request.agent(app);
    await registerVendor(agentA, "b");
    const createRes = await agentA
      .post("/api/products")
      .field("title", "Tulip Bunch")
      .field("priceCents", "2000")
      .field("quantity", "3");
    const productId = createRes.body.product._id;

    const agentB = request.agent(app);
    await registerVendor(agentB, "c");

    const updateRes = await agentB.patch(`/api/products/${productId}`).send({ priceCents: 9999 });
    expect(updateRes.status).toBe(403);

    const deleteRes = await agentB.delete(`/api/products/${productId}`);
    expect(deleteRes.status).toBe(403);
  });
});
