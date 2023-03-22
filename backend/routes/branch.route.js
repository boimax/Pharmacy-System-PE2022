const express = require('express');
const branch = require('../services/branch');
const val = require('express-validator');
const { validationResult } = require('express-validator');
const { InputError } = require('../error/Errors');

const router = new express.Router();
 
router.get('/', async (req, res, next) => {
  let options = { 
  };
  try {
    const result = await branch.getBranch(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});
 
router.get('/:id',val.param("id").isInt({min:0}),
async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) throw new InputError(errs);
    let options = { 
      "id": req.params.id,
    };
    const result = await branch.getId(options);
    console.log("hehe",result);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;