// Runs before the test framework loads app code, so these values are in
// place before config/env.js reads process.env. dotenv.config() never
// overwrites already-set vars, so a developer's real .env can't leak in.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_only_secret_do_not_use_in_prod";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.COOKIE_NAME = "posy_token";
process.env.STRIPE_SECRET_KEY = "sk_test_dummy_unused_because_stripe_is_mocked";
