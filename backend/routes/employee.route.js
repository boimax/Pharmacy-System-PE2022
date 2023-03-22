const express = require("express");
const employee = require("../services/employee");
const { uploadImage } = require("../utils/imageHandler");
const router = new express.Router();
const crypto = require("crypto");
const config = require("../config");
const { query, body, oneOf, validationResult } = require("express-validator");
router.get(
  "/",
  query("id").optional().isInt({min:0}), query("bid").optional().isInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let options = {
      id: req.query.id,
      bid: req.query.bid,
    };

    try {
      let result;
      if (options.id==undefined && options.bid==undefined) {
        result = await employee.listAllUser();
      }else
      if (options.bid == undefined) {
        result = await employee.showOneUserInfo(options);
      } else {
        result = await employee.listAllUserInBranch(options);
      }
      res.status(result.status || 200).json(result.data);
    } catch (err) {
      next(err);
    }
    return;

  }
);

router.post("/", async (req, res, next) => {
  // console.log('line 24 post /',req);
  let options = {};
  // options.postEmployeeInlineReqJson.ename=req.body.ename;
  // options.postEmployeeInlineReqJson.mail=req.body.mail;
  // options.postEmployeeInlineReqJson.erole=req.body.erole;
  // options.postEmployeeInlineReqJson.bid=req.body.bid;
  // options.postEmployeeInlineReqJson.pass=req.body.pass;
  // options.postEmployeeInlineReqJson.url=req.body.url;
  try {
    options.postEmployeeInlineReqJson = JSON.parse(req.body.text);
    let imageName = crypto.randomUUID() + ".jpeg";
    options.postEmployeeInlineReqJson.url =
      config.s3BucketName + "." + config.s3Endpoint + "/" + imageName;

    const imageBuffer = req.files[0].buffer;
    const status = uploadImage(imageBuffer, imageName);

    const result = await employee.postEmployee(options);

    // dont need to wait for  finishing upload image, just return
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/",
  body("password").optional().isString().isLength({ min: 1 }),
  body("eid").isInt({min:1}),
  body("url").optional().isString(),
  body("email").optional().isEmail(),


  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let options = {};
    
    try {
      options.putEmployeeInlineReqJson = req.body;
      // options.putEmployeeInlineReqJson.pass = req.body.pass;
      // options.putEmployeeInlineReqJson.url = req.body.url;
      // options.putEmployeeInlineReqJson.eid = req.body.eid;
      const result = await employee.putEmployee(options);
      res.status(result.status || 200).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/", query("employeeID").isInt({min:0}), async (req, res, next) => {
  console.log("this is body", req.query);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let options = {
    eid: req.query.employeeID,
  };

  try {
    const result = await employee.deleteEmployee(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
