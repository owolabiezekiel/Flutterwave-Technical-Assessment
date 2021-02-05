const supertest = require('supertest');
const app = require('../server');

describe("Testing the Validate-Rule API", () => {

	it("tests the base route and returns 200 for status", async () => {
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
  
  // Testing the POST /validate-rule endpoint for success
	it("tests the validate rule endpoint and returns a success message", async () => {
		var response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "gte",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });
		expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('field missions successfully validated.');
    expect(response.body.data.validation.error).toBe(false)

    response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "gt",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 45
      }
    });

		expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('field missions successfully validated.');
    expect(response.body.data.validation.error).toBe(false)

    response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "contains",
        condition_value: "Hello"
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: "Hello"
      }
    });

		expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('field missions successfully validated.');
    expect(response.body.data.validation.error).toBe(false)
  });
  
  // Testing the POST /validate-rule endpoint for failure
  it("tests the validate rule endpoint and returns an error message", async () => {
		const response = await supertest(app).post('/validate-rule').send({
        rule: {
          field: "0",
          condition: "eq",
          condition_value: "a"
        },
        "data": "damien-marley"
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field 0 failed validation.');
    expect(response.body.data.validation.error).toBe(true)
  });

  // Testing the POST /validate-rule endpoint for failure
  it("tests the validate rule endpoint and returns an error message for not equality", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "neq",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field missions failed validation.');
    expect(response.body.data.validation.error).toBe(true)
  });

  // Testing the POST /validate-rule endpoint for failure
  it("tests the validate rule endpoint and returns an error message for not supplying field value in rule data", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        condition: "neq",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field is required.');
    expect(response.body.data).toBe(null);
  });

  // Testing the POST /validate-rule endpoint for failure
  it("tests the validate rule endpoint and returns an error message for not supplying condition value in rule data", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('condition is required.');
    expect(response.body.data).toBe(null);
  });


  // Testing the POST /validate-rule endpoint for failure
  it("tests the validate rule endpoint and returns an error message for not supplying condition_value value in rule data", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "neq"
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('condition_value is required.');
    expect(response.body.data).toBe(null);
  });



  // Testing the POST /validate-rule endpoint for failure of contains
  it("tests the validate rule endpoint and returns an error message for for contains when either values is not a string", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "contains",
        condition_value: 3
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 5
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field missions failed validation.');
    expect(response.body.data.validation.error).toBe(true)
  });

  // Testing the POST /validate-rule endpoint for failure by supplying invalid test conditions
  it("tests the validate rule endpoint and returns an error message for not equality", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "missions",
        condition: "seq",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 30
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field missions failed validation.');
    expect(response.body.data.validation.error).toBe(true)
  });
  
  // Testing the POST /validate-rule endpoint for failure by not supplying the rule field
  it("tests the validate rule endpoint without suplying rule field", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      data: "damien-marley"
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('rule is required.');
    expect(response.body.data).toBe(null);
  });


  // Testing the POST /validate-rule endpoint for failure by not supplying the data field
  it("tests the validate rule endpoint without suplying data field", async () => {
		const response = await supertest(app).post('/validate-rule').send({
      rule: {
        field: "0",
        condition: "eq",
        condition_value: "a"
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('data is required.');
    expect(response.body.data).toBe(null);
  });

  // Testing the POST /validate-rule endpoint for failure by not right data type for rule field
  it("tests the validate rule endpoint without supplying correct data type for rule field", async () => {
		const response = await supertest(app).post('/validate-rule').send({
        rule: ["An", "Array", "of", "Strings"],
        data: "damien-marley"
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('rule should be an object.');
    expect(response.body.data).toBe(null);
  });

  // Testing the POST /validate-rule endpoint for failure by making rule object be missing from the data passed
  it("tests the validate rule endpoint by making rule object be missing from the data passed", async () => {
		const response = await supertest(app).post('/validate-rule').send({
       rule: {
        field: "missions",
        condition: "gte",
        condition_value: 30
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        //missions: 45
      }
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('field missions is missing from data.');
    expect(response.body.data).toBe(null);
  });
  
});