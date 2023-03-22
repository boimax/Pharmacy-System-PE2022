const db = require("../database");
const {BusinessError} = require("../error/Errors");
const emp = require("./employee");
module.exports = {
  /**
  * 
  * @param options.bid  

  */
  getId: async (options) => {
    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    var data = {
        branchID: "<number>",
        name: "<string>",
      },
      status = "200";
      var result = await emp.listAllUserInBranch(options);
      var mgr;
      result.data.forEach(element => {
        if (element.tag=="MGR")
        {mgr=element;}
      });
      console.log("manager",mgr);
      if(mgr==undefined) throw new BusinessError("this branch has no manager");
      var result = await db.getEmployeeByEID({ eid: mgr.id });
      data.branchID = result[0].bid;
      data.name = result[0].ename;

    return {
      status: status,
      data: data,
    };
  },
};
