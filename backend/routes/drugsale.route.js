const express = require('express');
const { query } = require('express-validator');
const revenue = require('../services/revenue');
const router = new express.Router();
const logger = require('../utils/logger');
const {validationResult} = require("express-validator");
const {InputError} = require("../error/Errors");

router.get('/',query("step").isInt(),query("year").isInt(),query("month").isInt(), async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);
    console.log("checked in ");
    let today = new Date();
    let year = req.query.year || today.getUTCFullYear();
    let month = req.query.month || today.getUTCMonth();
    let step = req.query.step || 3;
    let endDate = new Date(year,month-1)
    let startDate = new Date(year,month-step-1);
    console.log("find start and end",startDate.toLocaleDateString(),endDate.toLocaleDateString())
  let options = { 
    BID: req.query.BID,
    end_date: endDate.toJSON().substring(0,10),
    start_date: startDate.toJSON().substring(0,10),
  };
  logger.info(`BID info ${options.BID,options.start_date,options.end_date}`);

    let result;
    if(options.BID == undefined)  result = await revenue.getDrugSaleCompany(options);
    else result = await revenue.getDrugSaleBranch(options);
    logger.debug(`result ${result}`);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});


module.exports = router;
