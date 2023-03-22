const db = require('../database');
const {BusinessError} = require('../error/Errors');
const mailx = require('../mailx');

module.exports = {
  /**
  * 

  * @param options.postBillInlineReqJson.bid
  * @param options.postBillInlineReqJson.eid
  * @param options.postBillInlineReqJson.drugList
  * @param options.postBillInlineReqJson.total
  * @param options.postBillInlineReqJson.dmy

  */
  postBill: async (options) => {


    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    console.log("option",options.postBillInlineReqJson.drugList)
    var data = {}, status = '200',err = undefined;

      // we pretty much need transaction here 
      const result = await db.inv.createInvoiceWithoutIID(options.postBillInlineReqJson);
      for (let index = 0; index < options.postBillInlineReqJson.drugList.length; index++) {
        const element = options.postBillInlineReqJson.drugList[index];
        db.pre.createPrescriptionWithIDs({
          iid: result[0].iid,
          did: element.did,
          qnt: element.qnt
        });
        // console.log("element",element);
        var remain = await db.sto.getStockQNTWithIDs({
          bid: options.postBillInlineReqJson.bid,
          did: element.did
        });
        remain = remain[0] ? remain[0].qnt : 0;
        // console.log("remain",remain);

        var quantity = remain - element.qnt;
        if(quantity <0){
          let manager = (await db.bra.getBranchManagerByBID(options.postBillInlineReqJson))[0];
          let mail = (await db.emp.getEmployeeMailByEID({eid:manager.mgrid}))[0].mail;
          console.log("informing manager about stock via gmail",manager,mail);
          mailx({to:mail,subject:"drug out of stock", content:`drug with drugID ${element.did} is out of stock, please refill it` });
          throw new BusinessError(`drug with drugID ${element.did} is out of stock`)
        }
        db.sto.updateStockWithIDs({
          did: element.did,
          bid: options.postBillInlineReqJson.bid,
          qnt: quantity
        });
      }

    return {
      status: status,
      data: err
    };  
  },
};
