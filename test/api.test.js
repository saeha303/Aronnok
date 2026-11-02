const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

let mongo, app, mongoose, User;

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.DATABASE = mongo.getUri("aronnok-test");
  process.env.SECRET = "test-secret";
  app = require("../app");
  mongoose = require("mongoose");
  User = require("../models/user");
  await mongoose.connection.asPromise();

  await User.create([
    { firstname: "Ada", lastname: "Admin", username: "admin", email: "admin@test.dev", mobile: "1", password: "admin123", role: 1 },
    { firstname: "Bo", lastname: "Buyer", username: "bo", email: "bo@test.dev", mobile: "2", password: "buyer123" },
    { firstname: "Cy", lastname: "Other", username: "cy", email: "cy@test.dev", mobile: "3", password: "other123" },
  ]);
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const login = async (username, password) => {
  const agent = request.agent(app);
  const res = await agent.post("/api/signin").send({ username, password });
  assert.equal(res.status, 200, res.text);
  return { agent, user: res.body.user };
};

test("health check responds", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("signup validates input and creates a user", async () => {
  const bad = await request(app).post("/api/signup").send({ username: "x", email: "nope", password: "1" });
  assert.equal(bad.status, 422);

  const ok = await request(app).post("/api/signup").send({
    firstname: "New", lastname: "User", username: "newbie", email: "new@test.dev", mobile: "4", password: "secret123", role: 1,
  });
  assert.equal(ok.status, 201, ok.text);
  const created = await User.findOne({ username: "newbie" });
  assert.equal(created.role, 0, "signup must not be able to grant admin");
  assert.ok(created.encry_password.startsWith("$2"), "password should be a bcrypt hash");
});

test("signin accepts username or email and rejects bad passwords", async () => {
  await login("bo", "buyer123");
  await login("bo@test.dev", "buyer123");
  const res = await request(app).post("/api/signin").send({ username: "bo", password: "wrong" });
  assert.equal(res.status, 401);
  const missing = await request(app).post("/api/signin").send({ username: "ghost", password: "x" });
  assert.equal(missing.status, 401);
});

test("signin sets an httpOnly cookie and never returns the password hash", async () => {
  const res = await request(app).post("/api/signin").send({ username: "bo", password: "buyer123" });
  assert.match(res.headers["set-cookie"][0], /token=.*HttpOnly/i);
  assert.equal(res.body.user.encry_password, undefined);
  assert.equal(res.body.user.salt, undefined);
});

test("protected routes require a login", async () => {
  const bo = await User.findOne({ username: "bo" });
  const res = await request(app).get(`/api/user/${bo._id}`);
  assert.equal(res.status, 401);
});

test("users can read their own profile but not someone else's", async () => {
  const { agent, user } = await login("bo", "buyer123");
  const cy = await User.findOne({ username: "cy" });

  assert.equal((await agent.get(`/api/user/${user._id}`)).status, 200);
  assert.equal((await agent.get(`/api/user/${cy._id}`)).status, 403);
});

test("users cannot promote themselves to admin", async () => {
  const { agent, user } = await login("bo", "buyer123");
  const res = await agent.put(`/api/user/${user._id}`).send({ role: 1, firstname: "Bob" });
  assert.equal(res.status, 200, res.text);
  const fresh = await User.findById(user._id);
  assert.equal(fresh.role, 0);
  assert.equal(fresh.firstname, "Bob");
});

test("admin-only routes reject regular users and allow admins", async () => {
  const buyer = await login("bo", "buyer123");
  assert.equal((await buyer.agent.get("/api/getAllUser")).status, 403);

  const admin = await login("admin", "admin123");
  const res = await admin.agent.get("/api/getAllUser");
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 3);
  assert.ok(res.body.every((u) => u.encry_password === undefined && u.salt === undefined));
});

test("accounts with the old HMAC hash can still log in and are upgraded to bcrypt", async () => {
  const salt = "legacy-salt";
  const hash = crypto.createHmac("sha256", salt).update("oldpass1").digest("hex");
  await User.collection.insertOne({
    firstname: "Old", lastname: "Timer", username: "legacy", email: "legacy@test.dev", mobile: "5",
    encry_password: hash, salt, role: 0,
  });

  await login("legacy", "oldpass1");
  const upgraded = await User.findOne({ username: "legacy" });
  assert.ok(upgraded.encry_password.startsWith("$2"));
  await login("legacy", "oldpass1"); // still works after the upgrade
});

test("unknown API routes return JSON 404", async () => {
  const res = await request(app).get("/api/does-not-exist");
  assert.equal(res.status, 404);
  assert.equal(res.body.error, "Not found");
});
