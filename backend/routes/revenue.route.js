const express = require("express");
const revenue = require("../services/revenue");
const router = new express.Router();
const logger = require("../utils/logger");
const { query, validationResult } = require("express-validator");
const {InputError} = require("../error/Errors");
router.get(
  "/",
  query("year").isInt({min:1900,max:9999}),
  query("month").isInt({min:1,max:12}),
  query("BID").isInt({min:1}).optional(),
  async (req, res, next) => {
    try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);
    let options = {
      year: req.query.year,
      month: req.query.month,
      BID: req.query.BID,
    };
    logger.info(`BID info ${options.BID}`);

   
      let result;
      if (options.BID == undefined)
        result = await revenue.getRevenueCompany(options);
      else result = await revenue.getRevenueBranch(options);
      logger.debug(`result ${result}`);
      res.status(result.status || 200).send(result.data);
    } catch (err) {
      logger.error(err.stack);
      return res.status(500).send({
        error: err || "Something went wrong.",
      });
    }
  } 
);

router.use('/drugsale',require("./drugsale.route"));
module.exports = router;
