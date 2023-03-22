const { json } = require('express');
const db = require('../database');

module.exports = {
  /** 
  get all the information on a specific type of drug
    * @param options.postBillInlineReqJson.drugID the ID of the drug we want to search

   * @returns a drug object
  */
  getDrugByID: async (options) => {
    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    var data = await db.dru.getDrugByDID({ did: options.drugID });
    var status = 200;
    return {
      status: status,
      data: data
    };
  },

  // This service return an array of arrays with DID as string and QNT as number
  // All arrays have been sorted by their QNT
  // Input is a json with 3 properties: {branchID: <number>, month: <number>, year: <number>}
  getTopDrugsOfBranch: async (options) => {
    let checkpoint_in_time = [...(Array(12).keys())].map((elem) => {
      let a = new Date(options.year, options.month);
      a.setMonth(a.getMonth() - elem);
      return a;
    });
  
    const promisedIIDs = checkpoint_in_time.map(async (elem) => {
      // console.log(elem);
      if (elem.getMonth() == 0)
        var t = await db.inv.getInvoiceByBIDDMY({ bid: options.branchID, month: 12, year: elem.getUTCFullYear() })
      else
        var t = await db.inv.getInvoiceByBIDDMY({ bid: options.branchID, month: elem.getMonth(), year: elem.getUTCFullYear() })
      // console.log(t)
      return t;
    });
    const iids = await Promise.all(promisedIIDs);
    // console.log(iids);
  
    var data = {};
    const promisedQNTs = iids.map(async (elem) => {
      // console.log(elem);
      const promisedJSON = elem.map(async (e) => {
        var t = await db.pre.getPrescriptionWithIID({iid: e.iid});
        t.forEach(e => {
          var qnt = e.qnt;
          var did = e.did;
          if(data[did] == undefined)
            data[did] = qnt;
          else
            data[did] = data[did] + qnt;
        });
      });
      await Promise.all(promisedJSON);
    });
    await Promise.all(promisedQNTs);
  
    let top = [];
    for(var did in data){
      top.push([did, data[did]]);
    }
    top.sort((a, b) => a[1] - b[1]);
    console.log(top);
    var status = 200;
    return {
      status: status,
      data: top
    };
  },

  // This service return an array of arrays with DID as string and QNT as number
  // All arrays have been sorted by their QNT
  // Input is a json with 2 properties: {month: <number>, year: <number>}
  getTopDrugsOfCompany: async (options) => {
    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    let checkpoint_in_time = [...(Array(12).keys())].map((elem) => {
      let a = new Date(options.year, options.month);
      a.setMonth(a.getMonth() - elem);
      return a;
    });
  
    const promisedIIDs = checkpoint_in_time.map(async (elem) => {
      // console.log(elem);
      if (elem.getMonth() == 0)
        var t = await db.inv.getInvoiceByDMY({ month: 12, year: elem.getUTCFullYear() })
      else
        var t = await db.inv.getInvoiceByDMY({ month: elem.getMonth(), year: elem.getUTCFullYear() })
      // console.log(t)
      return t;
    });
    const iids = await Promise.all(promisedIIDs);
    // console.log(iids);
  
    var data = {};
    const promisedQNTs = iids.map(async (elem) => {
      // console.log(elem);
      const promisedJSON = elem.map(async (e) => {
        var t = await db.pre.getPrescriptionWithIID({iid: e.iid});
        t.forEach(e => {
          var qnt = e.qnt;
          var did = e.did;
          if(data[did] == undefined)
            data[did] = qnt;
          else
            data[did] = data[did] + qnt;
        });
      });
      await Promise.all(promisedJSON);
    });
    await Promise.all(promisedQNTs);
  
    let top = [];
    for(var did in data){
      top.push([did, data[did]]);
    }
    top.sort((a, b) => a[1] - b[1]);
    var status = 200;
    return {
      status: status,
      data: top
    };
  },

  /** 
  get all the drug stock informations in a branch
    * @param options.postBillInlineReqJson.branchID

   * @returns a list of stock
  */
  getDrugsInBranch: async (options) => {


    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    
      var status = 200;
      var data = await db.sto.getStockWithBID({bid:options.branchID});
      const promisedInfo = data.map(async(elem)=>{
        const drugInfo = (await db.dru.getDrugByDID(elem))[0];
        drugInfo.qnt = elem.qnt;
        return drugInfo;
      });
      const drugWithStockInfo = await Promise.all(promisedInfo);
      console.log(drugWithStockInfo)
      return {status:status,data:drugWithStockInfo};
    },


 /** 
 update stock of a drug with specific drugID in a branch
   * @param options.postBillInlineReqJson.branchID
   * @param options.postBillInlineReqJson.drugID
   * @param options.postBillInlineReqJson.number
  * @returns nothing
 */
  adjustStockOfDrugInBranch: async (options) => {
    let qnt = await db.sto.getStockQNTWithIDs({bid:options.branchID,did:options.drugID});
    console.log("qnt",qnt);
    if(qnt.length == 0){
      await db.sto.createStockWithIDs({bid:options.branchID,did:options.drugID,qnt:options.number});
    }else{
      await db.sto.addStockWithIDs({bid:options.branchID,did:options.drugID,qnt:options.number});
    }
    return 1;
  },
};
