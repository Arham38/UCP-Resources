const { validationResult } = require("express-validator");

/**
 * Reads express-validator results and short-circuits with 422 if invalid.
 * Drop this after any array of validation rules in a route.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validateRequest };
