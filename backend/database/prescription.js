const db = require('./db');

async function getPrescriptionWithIID(inp){
    const text = 'SELECT *\nFROM PE.PRESCRIPTION\nWHERE IID = $1';
    const values = [inp.iid];
    const result = await db.query(text, values);
    return result.rows;

}

async function createPrescriptionWithIDs(inp){
    const text = 'INSERT INTO PE.PRESCRIPTION(IID, DID, QNT)\nVALUES($1, $2, $3)';
    const values = [inp.iid, inp.did, inp.qnt];
    console.log(values);
    await db.query(text, values);
}

async function updatePrescriptionWithIDs(inp){
    const text = 'UPDATE PE.PRESCRIPTION\nSET QNT = $3\nWHERE IID = $1 AND DID = $2';
    const values = [inp.iid, inp.did, inp.qnt];
    await db.query(text, values);
}

async function deletePrescriptionWithIDs(inp){
    const text = 'DELETE FROM PE.PRESCRIPTION\nWHERE IID = $1 AND DID = $2';
    const values = [inp.iid, inp.did];
    await db.query(text, values);
}

async function getAmountDrugSoldWithBID(BID,startDate,endDate){
    const text = "select did,sum(qnt) as qnt from pe.prescription where iid in (select iid from pe.invoice where bid=$1 and dmy between $2 and $3) group by did;"
    const values = [BID,startDate,endDate];
    const result = await db.query(text,values);
    // console.log('result',result.rows)
    return result.rows.map((elem)=>{elem.qnt = parseInt(elem.qnt);return elem});
}

async function getAmountDrugSoldInEachBranches(startDate,endDate){
    const text = "select did,bid,sum(qnt) as qnt  from pe.prescription natural join pe.invoice where iid in (select iid from pe.invoice where dmy between $1 and $2) group by did,bid;"
    const values = [startDate,endDate];
    const result = await db.query(text,values);
    // console.log('result',result.rows.map((elem)=>{elem.qnt = parseInt(elem.qnt);return elem}));
    return result.rows.map((elem)=>{elem.qnt = parseInt(elem.qnt);return elem});
}
const input = require('./input.json');
// getPrescriptionWithIID(input);

module.exports = {
    getPrescriptionWithIID,
    createPrescriptionWithIDs,
    updatePrescriptionWithIDs,
    deletePrescriptionWithIDs,
    getAmountDrugSoldWithBID,
    getAmountDrugSoldInEachBranches
}