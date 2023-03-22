const express = require('express');
const { body, validationResult } = require('express-validator');
const { InputError } = require('../error/Errors');
const bill = require('../services/bill');
const router = new express.Router();
 
router.post('/',body("eid").isInt({min:1}),
                body("bid").isInt({min:1}),
                body("dmy").isDate({format:"DD/MM/YYYY"}),
                body("total").isFloat({min:0}), 
                body("drugList").isArray(), 
                async (req, res, next) => {
  let options = {
  };

  options.postBillInlineReqJson = req.body;
  options.postBillInlineReqJson.eid = req.body.eid;
  options.postBillInlineReqJson.bid = req.body.bid;
  options.postBillInlineReqJson.dmy = req.body.dmy;
  options.postBillInlineReqJson.total = req.body.total;
  options.postBillInlineReqJson.drugList = req.body.drugList;
  try {
    // validationResult(req).throw();
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);

    const result = await bill.postBill(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;