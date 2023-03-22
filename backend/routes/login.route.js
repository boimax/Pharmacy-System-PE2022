const express = require("express");
const login = require("../services/login");
const router = new express.Router();
const { body, validationResult } = require("express-validator");
router.post(
  "/",
  body("username").isString().isLength({ min: 1 }),
  body("password").isString().isLength({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.body.username || !req.body.password) {
      return res.status(422).json({ errors: errors.array() });
    }
    let options = {};
    options.postLoginInlineReqJson = req.body;
    console.log("login body: ", req.body);

    try {
      const result = await login.postLogin(options);
      res.status(result.status || 200).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
