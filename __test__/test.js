const supertest = require('supertest');
const app = require('../server');

describe("Testing the Validate-Rule API", () => {
	it("tests the base route and returns true for status", async () => {
		const response = await supertest(app).get('/');
		expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("My Rule-Validation API");
    expect(response.body.data).toEqual({
      name: "Tobiloba Owolabi",
      github: "@owolabiezekiel",
      email: "owo.ezekiel@gmail.com",
      mobile: "08106723916",
      twitter: "@Toby_Ezekiel"
    });
  
	});
});