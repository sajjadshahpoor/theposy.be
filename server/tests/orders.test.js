import { jest } from "@jest/globals";

// Must run before the mocked module (or anything importing it) is loaded,
// so config/stripe.js is replaced everywhere the app imports it -- checkout
// tests exercise real order/stock logic without hitting the Stripe API.
jest.unstable_mockModule("../src/config/stripe.js", () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: "pi_test_123", client_secret: "secret_test_123" }),
      update: jest.fn().mockResolvedValue({}),
    },
  },
}));

const request = (await import("supertest")).default;
const { createApp } = await import("../src/app.js");
const { connectTestDb, clearTestDb, disconnectTestDb } = await import("./testDb.js");

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

async function setupVendorWithProduct() {
  const vendorAgent = request.agent(app);
  const vendorRes = await vendorAgent.post("/api/auth/vendor/register").send({
    shopName: "Order Test Shop",
    ownerName: "Owner",
    email: "ordervendor@example.com",
    password: "password123",
    address: "Street 1",
    city: "Brussels",
    postalCode: "1000",
    location: { coordinates: [4.35, 50.85] },
  });
  const vendorId = vendorRes.body.vendor._id;

  const productRes = await vendorAgent
    .post("/api/products")
    .field("title", "Lily Bunch")
    .field("priceCents", "2500")
    .field("quantity", "3");
  const productId = productRes.body.product._id;

  return { vendorAgent, vendorId, productId };
}

describe("Checkout", () => {
  test("guest checkout requires an email, creates an order, and decrements stock", async () => {
    const { vendorId, productId } = await setupVendorWithProduct();

    const noEmailRes = await request(app)
      .post("/api/orders")
      .send({
        vendorId,
        items: [{ productId, quantity: 1 }],
        deliveryAddress: { street: "Meir 10", city: "Antwerp", postalCode: "2000" },
      });
    expect(noEmailRes.status).toBe(400);

    const res = await request(app)
      .post("/api/orders")
      .send({
        vendorId,
        items: [{ productId, quantity: 2 }],
        deliveryAddress: { street: "Meir 10", city: "Antwerp", postalCode: "2000" },
        guestInfo: { name: "Jane Doe", email: "jane@example.com" },
      });

    expect(res.status).toBe(201);
    expect(res.body.order.totalCents).toBe(2500 * 2 + 500);
    expect(res.body.clientSecret).toBe("secret_test_123");

    const productRes = await request(app).get(`/api/products/${productId}`);
    expect(productRes.body.product.quantity).toBe(1);
  });

  test("rejects checkout when requested quantity exceeds stock", async () => {
    const { vendorId, productId } = await setupVendorWithProduct();

    const res = await request(app)
      .post("/api/orders")
      .send({
        vendorId,
        items: [{ productId, quantity: 99 }],
        deliveryAddress: { street: "Meir 10", city: "Antwerp", postalCode: "2000" },
        guestInfo: { name: "Jane Doe", email: "jane@example.com" },
      });

    expect(res.status).toBe(400);
  });
});

describe("Order status transitions", () => {
  test("a vendor can advance status through the state machine; invalid jumps are rejected", async () => {
    const { vendorAgent, vendorId, productId } = await setupVendorWithProduct();

    const orderRes = await request(app)
      .post("/api/orders")
      .send({
        vendorId,
        items: [{ productId, quantity: 1 }],
        deliveryAddress: { street: "Meir 10", city: "Antwerp", postalCode: "2000" },
        guestInfo: { name: "Jane Doe", email: "jane@example.com" },
      });
    const orderId = orderRes.body.order._id;

    const skipAhead = await vendorAgent.patch(`/api/orders/${orderId}/status`).send({ status: "delivered" });
    expect(skipAhead.status).toBe(400);

    const step1 = await vendorAgent.patch(`/api/orders/${orderId}/status`).send({ status: "preparing" });
    expect(step1.status).toBe(200);
    expect(step1.body.order.status).toBe("preparing");

    const step2 = await vendorAgent
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: "out_for_delivery" });
    expect(step2.status).toBe(200);
    expect(step2.body.order.statusHistory).toHaveLength(3);
  });
});
