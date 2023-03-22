const { AccessControl } = require('accesscontrol');
const { response } = require('express');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { PermissionError } = require('../error/Errors.js');


// const resources = {employee:'employee_info',revenue_branch:'revenue',bills:'bills'}
const ac = new AccessControl();
ac.grant('EMP').createAny('login').readAny('login').readAny('employee').createAny('bill').readAny('drugs')
  .grant('MGR').extend('EMP').readOwn('revenue').createAny('employee').updateAny('employee').readOwn('branch').deleteAny('employee').createOwn('drugs')
  .grant('CEO').extend('MGR').readAny('revenue').readAny('manager').readAny('branch');
const roles =ac.getRoles();
console.log(ac.can('MGR').readOwn('revenue').granted);
// console.log(ac.can('manager').createAny('revenue').granted);
  // roles = {
  //   ceo: [
  //     "/bill",
  //     "/branch",
  //     "/drug",
  //     "/drugs",
  //     "/employee",
  //     "/login",
  //     "/manager",
  //     "/revenue",
  //   ],
  //   manager: [
  //     "/bill",
  //     "/branch",
  //     "/drug",
  //     "/drugs",
  //     "/employee",
  //     "/login",
  //     "/manager",
  //   ],
  //   employee: ["/bill", "/drug", "/drugs", "/employee", "/login"],
  // };



// module.exports = {
//   /**
//     * 
//     * @param options.postLoginInlineReqJson.token
//     * @param options.postLoginInlineReqJson.role
  
//     */
//   authorize: (req, res, next) => {
//     var url = req.url;
//     var method = req.method;
//     if (url != "/login") {
//       options = req.body;
//       jwt.verify(options.token, config.secret, (err, decoded) => {
//         if (err) {
//           res.sendStatus(401);
//           return;
//         }
//         role = options.role;
//         if (Object.keys(roles).includes(role)) {
//           if (roles[role].includes(url)) 
//           {
//             console.log(role);
//             next();
//           }
//           else res.sendStatus(403);
//         } else res.sendStatus(403);
//       });
//     }
//   },
// };

module.exports = {
  /**
    * 
    * @param options.postLoginInlineReqJson.token
    * @param options.postLoginInlineReqJson.role
  
    */
  authorize: (req, res, next) => {
    let pathName = req._parsedUrl.pathname;
    console.log('method: ',req.method);
    console.log('url: ',pathName,typeof(pathName))
    var method = req.method;
    let a = req.headers;
    console.log('authorization: ',a.authorization);
    if(pathName.startsWith('/login')){
      console.log('skipping to login')
      next();
      return;
    }
    if(a.authorization == undefined){
      console.log('no authorization, going back to login');
      res.redirect('/login')
      return;
    }
    let [scheme,token] = req.headers.authorization.split(' ');
    console.log('damn token',token);
    jwt.verify(token, config.secret, (err, decoded) => {
      console.log('decoded: ',decoded,err)
      if (err) {
        res.sendStatus(401);
        return;
      }
      role = decoded.role;
      if(!roles.includes(role)){
        throw new PermissionError(`the role ${role} does not exist in our system`);
        return;
      }
      // console.log(req);
      console.log('path',pathName)
      resource = pathName.split('/'); // remove / in url
      resource = resource[1];
      var isAllowed = false;
      console.log('resource:',resource);
      switch (method) {
        case 'GET':
          isAllowed = ac.can(role).readOwn(resource).granted;
          break;
        case 'POST':
          isAllowed = ac.can(role).createOwn(resource).granted;
          break;
        case 'DELETE':
          isAllowed = ac.can(role).deleteOwn(resource).granted;
          break;
        case 'PUT':
          isAllowed = ac.can(role).updateOwn(resource).granted;
        default:
          break;
      }
      if(isAllowed)
        {
          next();
        }
        else throw new PermissionError(`you are not allowed to do the action as a ${role}`);
      });
    }
  }
