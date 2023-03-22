const db = require('../database');
const logger = require('../utils/logger');

module.exports = {
  /**
  * 


  */
  getBranch: async (options) => {

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
    var data = {}, status = '200';
    data = await db.bra.getAllBranches();
    logger.debug(`all branch infos ${data}`)
    return {
      status: status,
      data: data
    };  
  },

  /**
  * 
  * @param options.id  

  */
  getId: async (options) => {

    var data = {}, status = '200';
    data = await db.bra.getBranchByBID({bid:options.id});
    return {
      status: status,
      data: data
    };  
  },
};
