const express = require('express');
const manager = require('../services/manager');
const router = new express.Router();
const { param, validationResult } = require("express-validator");
router.get('/:bid', param('bid').isInt({min:1}),async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let options = { 
    "bid": req.params.bid,
  };
  console.log(options);
  try {
    const result = await manager.getId(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;
