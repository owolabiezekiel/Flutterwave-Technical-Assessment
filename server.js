const express = require('express')

const app = express()
app.use(express.json())

// verify valid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }

  next();
});


// Utility methods used by the POST endpoint to test rule validity
const isValid = (condition, condition_value, test_condition_value) => {

  const conditions = {
    equal: "eq",
    notEqual: "neq",
    greaterThan: "gt",
    greaterThanOrEqual: "gte",
    contains: "contains",
  };

  switch (condition) {
    case conditions.equal:
      return condition_value === test_condition_value;
    case conditions.notEqual:
      return condition_value !== test_condition_value;
    case conditions.greaterThan:
      return test_condition_value > condition_value
    case conditions.greaterThanOrEqual:
      return test_condition_value >= condition_value
    case conditions.contains:
      if(typeof condition_value !== "string" || typeof test_condition_value !== "string"){
        return false
      }
      return test_condition_value.includes(condition_value);
    default:
      return false;
  }
};


app.get('/', async(req, res) => {
  return res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Tobiloba Owolabi",
      github: "@owolabiezekiel",
      email: "owo.ezekiel@gmail.com",
      mobile: "08106723916",
      twitter: "@Toby_Ezekiel"
    }
  })
})

app.post("/validate-rule", async (req, res) => {
  const rule = req.body.rule;
  const data = req.body.data;

  // 1
  if (!rule) {
    return res.status(400).json({
      message: "rule is required.",
      status: "error",
      data: null,
    });
  }

  if (!data) {
    return res.status(400).json({
      message: "data is required.",
      status: "error",
      data: null,
    });
  }

  // 2
  if (rule.constructor.name !== "Object") {
    return res.status(400).json({
      message: "rule should be an object.",
      status: "error",
      data: null,
    });
  }

  if (
    data.constructor.name !== "Object" &&
    !Array.isArray(data) &&
    !typeof data === "string"
  ) {
    return res.status(400).json({
      message: "data should be either an object or an array or a string.",
      status: "error",
      data: null,
    });
  }

  if (!Object.keys(data).includes(rule.field)) {
    return res.status(400).json({
      message: `field ${rule.field} is missing from data.`,
      status: "error",
      data: null,
    });
  }


  if (isValid(rule.condition, rule.condition_value, data[rule.field] )) {
    return res.status(200).json({
      message: `field ${rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } else {
    return res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }
});

module.exports = app