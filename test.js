
import { describe, it } from "mocha";
import request from "supertest";
import assert from "node:assert/strict";
import app from "./src/app.js";

describe("GET /products", function () {
  it("should return status 200 and products page", async function () {
    const response = await request(app).get("/products");

    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /html/);
    assert.match(response.text, /products/i);
  });
});
