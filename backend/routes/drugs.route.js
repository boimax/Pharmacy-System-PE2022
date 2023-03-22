const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { getTopDrugsOfCompany, getTopDrugsOfBranch } = require('../services/drugs');
const drugs = require('../services/drugs');
const { getRevenueBranch, getDrugSaleCompany } = require('../services/revenue');
const router = new express.Router();

const logger = require('../utils/logger')

router.get('/', query("branchID").isInt({min:0}),async (req, res, next) => {
  let options = { 
    branchID: req.query.branchID
  };
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);


    const result = await drugs.getDrugsInBranch(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});
router.post('/',body("branchID").isInt({min:0}),
                body("drugID").isInt({min:0}), 
                body("quantity").isInt({min:0}),
                async (req, res, next) => {
  let options = {
  };
  
  try {
  options.branchID = req.body.branchID;
  options.drugID = req.body.drugID;
  options.number = req.body.quantity;

  const errs = validationResult(req);
  if (!errs.isEmpty()) throw new InputError(errs);
    const result = await drugs.adjustStockOfDrugInBranch(options);
    logger.info(result);
    res.sendStatus(200);
  }
  catch (err) {
    next(err);
  }
});

router.get('/:id',param("id").isInt({min:0}) ,async (req, res, next) => {
  let options = { 
    drugID: req.params.id,
  };
  try {
  logger.debug(`drugID ${options.drugID}`);
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);
    const result = await drugs.getDrugByID(options);
    logger.debug(`result ${result}`);

    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});

router.get('/:year/:month', param("year").isInt({min:1900, max:9999}), 
                    param("month").isInt({min: 1, max: 12}), query("branchID").optional().isInt({min: 1}), async (req, res, next) => {
  let options = {
    year: req.params.year,
    month: req.params.month,
    branchID: req.query.branchID,
  };
  let result;
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);    
    
    if(options.branchID == undefined){
      result = await getTopDrugsOfCompany(options);
    }
    else{ 
      result = await getTopDrugsOfBranch(options);
    }
  }
  catch (err) {
    next(err);
  }
  res.status(result.status || 200).send(result.data);
});
module.exports = router;
