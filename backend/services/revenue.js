const { loggers } = require('winston');
const db = require('../database');
const { getBranch } = require('./branch');

  /**
  * 
  get monthly revenue of a branch 
      * @param options.postBillInlineReqJson.year
      * @param options.postBillInlineReqJson.month
      * @param options.postBillInlineReqJson.BID
      * @returns the revenue/month of the 12 months prior to the requested date (as an array) 
  
  */
 const getRevenueBranch=async (options) => {
    // let requestedMonth = new 
    // get the revenue of the company in the previous 12 months
    let checkpoint_in_time = [...(Array(12).keys())].map((elem)=>{let a = new Date(options.year,options.month); a.setMonth(a.getMonth()-elem); return a;});
    let status=200;
    const promisedIncomeArr = checkpoint_in_time.map(async (elem)=>{
      const listRev =await db.inv.getMonthlyTotalIncomeByBID({bid:options.BID,month:elem.getMonth(),year:elem.getUTCFullYear()});
      const sum =  parseInt(listRev[0].sum);
      return {
        timestamp:elem,
        revenue: sum || 0
      }});
    const incomeArr = await Promise.all(promisedIncomeArr);
    
  
    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    return {
      status: status,
      data: incomeArr
    };  
  };
  
  /** 
  get all the revenue info in company in a year
      * @param options.postBillInlineReqJson.year
      * @param options.postBillInlineReqJson.month
      * @returns the revenue/month of the 12 months prior to the requested date (as an array) 
  */
const getRevenueCompany= async (options) => {
    var status = 200;
    let {data: branchInfo} = await  getBranch();
    // console.log('branch info',branchInfo);
    const promisedBranchesListWithRevenue = branchInfo.map(async (elem)=>{
      elem.financialStatement=(await getRevenueBranch({year:options.year,month:options.month,BID:elem.bid})).data;
      return elem;
    })
    const branchesListWithRevenue = await Promise.all(promisedBranchesListWithRevenue);
    // console.log('branches list',branchesListWithRevenue);
    const revenues = branchesListWithRevenue.reduce((prev,curr)=> {
      return {financialStatement:prev.financialStatement.map((revenueAndTime,index)=> {
        return {revenue:revenueAndTime.revenue+curr.financialStatement[index].revenue};
      })}})
    // console.log('revenues:',revenues.financialStatement);
    let checkpoint_in_time = [...(Array(12).keys())].map((elem)=>{let a = new Date(options.year,options.month); a.setMonth(a.getMonth()-elem); return a;});
    let data = {companyRevenue:[]}
    for (let index = 0; index < checkpoint_in_time.length; index++) {
      const element = {timestamp:checkpoint_in_time[index],revenue:revenues.financialStatement[index]}
      data.companyRevenue.push(element);
    }
    data.branchInfo = branchesListWithRevenue;
    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500



    return {
      status: status,
      data: data
    };  
  };

  /** 
  get all the drug sale info of a company from time A to time B
      * @param options.end_date
      * @param options.start_date
      * @returns the revenue/month of the 12 months prior to the requested date (as an array) 
  */
  const getDrugSaleCompany = async(options)=>{
    var status = 200;
    // in a branch get the money outcome from each kind of drug
    // get list of invoice id from 1 branch x
    let sumDrugs = {};
    let branchWithMostDrugSold = {};
    let drugSale = await db.pre.getAmountDrugSoldInEachBranches(options.start_date,options.end_date);
    // console.log("drug sale",drugSale);
    // sum all array with did=x
    drugSale.forEach((didSaleOfABranch)=>{
      let drugID = didSaleOfABranch.did.toString()
      if(sumDrugs[drugID] ==undefined){
        sumDrugs[drugID]= {qnt:didSaleOfABranch.qnt,branchWithMostSale:didSaleOfABranch.bid}
        branchWithMostDrugSold[drugID]= {qnt:parseInt(didSaleOfABranch.qnt),bid:didSaleOfABranch.bid}
        return;
      }else{
        sumDrugs[drugID].qnt +=didSaleOfABranch.qnt;
        if(branchWithMostDrugSold[drugID].qnt < didSaleOfABranch.qnt) {
          branchWithMostDrugSold[drugID].bid =didSaleOfABranch.bid
          branchWithMostDrugSold[drugID].qnt =didSaleOfABranch.qnt
          sumDrugs[drugID].branchWithMostSale =didSaleOfABranch.bid;
        }
      }
    })
    // console.log(sumDrugs);
    // console.log("drug info",drugSale)
    return {
      status: status,
      data: sumDrugs
    } 
  }


  
/**
* 
get this month drug sale of a branch 
    * @param options.start_date
    * @param options.end_date
    * @param options.BID
    * @returns the revenue/month of the 12 months prior to the requested date (as an array) 
*/
const getDrugSaleBranch = async(options)=>{
  var status = 200;
  // in a branch get the money outcome from each kind of drug
  // get list of invoice id from 1 branch x
  let drugSale = await db.pre.getAmountDrugSoldWithBID(options.BID,options.start_date,options.end_date);
  console.log(drugSale);
  let promisedDrugSale = drugSale.map(async(element)=>{
    // console.log("element",element);
    let drugInfo = (await db.dru.getDrugByDID(element))[0];
    drugInfo.quantitySold = element.qnt;
    // console.log("info",drugInfo)
    return drugInfo;
  })
  drugSale = await Promise.all(promisedDrugSale);
  console.log("drug info",drugSale)
  return {
    status: status,
    data: drugSale
  }
  
  // from prescription table, slect the invoice id list, group by did, aggregate by sum

}
module.exports={getRevenueBranch,getRevenueCompany,getDrugSaleBranch,getDrugSaleCompany}

// getDrugSaleBranch({BID:1,start_date:"29/01/1973",end_date:"29/07/2023"})
// getDrugSaleCompany({start_date:"29/01/1973",end_date:"29/07/2023"})