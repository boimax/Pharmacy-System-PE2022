const db = require('../database');
const mail = require('../mailx.js')
const argon2 = require('argon2');
const genPass=require('generate-password');
const { BusinessError } = require('../error/Errors');
module.exports = {
  listAllUser: async (options)=>{
    var allUser=await db.emp.getAllEmployee();
    data= allUser.map(async (element) => {
      let acc = await db.acc.getAccountByEID(element);
      acc = acc[0];
      // console.log("elem",element);
      let desiredInfo = element;
      desiredInfo.url = acc==undefined?"":acc.url;
      return (desiredInfo);
    });
  data = await Promise.all(data);
    return {data:data,status:200};
  },
  /**
  * 
  * @param options.bid ID of the branch 

  */
  listAllUserInBranch: async (options) => {
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

    var data = [], status = "200";
      var temp=await db.emp.getEmployeeByBID({ bid: options.bid });
      data= temp.map(async (element) => {
        let acc = await db.acc.getAccountByEID(element);
        acc = acc[0];
        // console.log("elem",element);
        let desiredInfo = element;
        desiredInfo.url = acc==undefined?"":acc.url;
        return (desiredInfo);
      });
    data = await Promise.all(data);
    return {
      status: status,
      data: data,
    };
  },

  /**
  * 
  * @param options.id ID of the user
  */
  showOneUserInfo: async(options)=>{
    var data = {},
      status = "200";
    let inp = {eid:options.id};
        let temp = (await db.emp.getEmployeeByEID(inp))[0];
        let acc =   (await  db.acc.getAccountByEID(inp))[0];
        if (temp==undefined) throw new BusinessError("the user does not exist");
        data = temp;
        data.url = acc.url;

    return {
      status: status,
      data: data,
    };
  },

  /**
  * 

  * @param options.postEmployeeInlineReqJson.birthday
  * @param options.postEmployeeInlineReqJson.name

  */
  postEmployee: async (options) => {
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
    var data = {},
      status = "200";
      var result = await db.emp.createEmployeeWithoutEID(options.postEmployeeInlineReqJson);
      console.log("result: ",result);
      var password = genPass.generate({
        length: 10,
        numbers: true
      });
      var hashedPass=await argon2.hash(password);
      console.log(hashedPass);
      await db.acc.createAccountWithEID({
        eid: result[0].eid,
        pass: hashedPass,
        url: options.postEmployeeInlineReqJson.url
      });
      mail({
        subject: "Account created",
        to:options.postEmployeeInlineReqJson.mail,
        message: "Your account has been created. Your username is: "+result[0].eid+" and your password is: "+password
      });
      data = result;
    return {
      status: status,
      data: data,
    };
  },

  /**
  * 

  * @param options.putEmployeeInlineReqJson.employeeID required
  * @param options.putEmployeeInlineReqJson.url
  * @param options.putEmployeeInlineReqJson.pass
  * @param options.putEmployeeInlineReqJson.email required
  * @param options.putEmployeeInlineReqJson.name
  */
  putEmployee: async (options) => {
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
    let body = options.putEmployeeInlineReqJson;
    console.log("body",body);
    let employee = await db.emp.getEmployeeByEID(body);
    if (employee.length==0) {
      throw new BusinessError("there is no user with that id");
    }
    let account = await db.acc.getAccountByEID(body);
    console.log("employee",employee,account);
    employee = employee[0];
    account = account[0];
    employee.pass = body.pass ? await argon2.hash(body.pass): account.pass;
    employee.mail = body.mail ?? employee.mail ;
    employee.ename = body.name ?? employee.ename;
    employee.url = body.url ?? account.url;
    console.log("updated data",employee);
    await db.acc.updateAccountByEID(employee);
    var data = {},
      status = "200";
      var result = await db.emp.updateEmployeeByEID(employee);
      data = result;

    return {
      status: status,
      data: data,
    };
  },

  /**
  * 
  * @param options.employeeID  

  */
  deleteEmployee: async (options) => {
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

    var data = {},
      status = "200";
      var result = await db.emp.deleteEmployeeByEID(options);
      console.log(options)
      data = result;

    return {
      status: status,
      data: data,
    };
  },
};
