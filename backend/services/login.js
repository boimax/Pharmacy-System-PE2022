const argon2 = require("argon2");

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../database");
module.exports = {
  /**
  * 

  * @param options.postLoginInlineReqJson.password
  * @param options.postLoginInlineReqJson.username

  */
  postLogin: async (options) => {

    var data = {},status = "200";


    // user is supposed to log in with his ID, so no username will exist, only ID
    var account = db.acc.getAccountByEID(
      {eid:options.postLoginInlineReqJson.username}
    );
    var employee = db.emp.getEmployeeByEID({eid:options.postLoginInlineReqJson.username});

    
    var result = await Promise.all([account,employee]);
    console.log('account and role of the user',result)
    if(result[0][0] == undefined) {
     return {status:401,data:"user does not exist"};
    }
    var hashed = result[0][0].pass;
    var role = result[1][0].erole;
    var bid = result[1][0].bid;
    var name = result[1][0].ename;
    var uid = result[1][0].eid;
    if (await argon2.verify(hashed, options.postLoginInlineReqJson.password)) {
      status = "200";
      data = jwt.sign(
        { uid: uid,name:name,role: role,url: result[0][0].url,bid: bid},
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );
    } else {
      status = 401;
      data = 'None';
    }
    return {
      status: status,
      data: data,
    };
  },
};
