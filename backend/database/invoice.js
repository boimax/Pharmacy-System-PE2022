const db = require('./db');

async function getInvoiceByBID(inp){
    const text = 'SELECT *\nFROM PE.INVOICE \nWHERE BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}

async function getInvoiceByDMY(inp){
    const text = 'SELECT IID\nFROM PE.INVOICE\nWHERE EXTRACT(MONTH FROM DMY) = $1 AND EXTRACT(YEAR FROM DMY) = $2'
    const values = [inp.month, inp.year];
    const result = await db.query(text, values);
    return result.rows;

}

async function getInvoiceByBIDDMY(inp){
    const text = 'SELECT IID\nFROM PE.INVOICE\nWHERE BID = $1 AND EXTRACT(MONTH FROM DMY) = $2 AND EXTRACT(YEAR FROM DMY) = $3';
    const values = [inp.bid, inp.month, inp.year];
    const result = await db.query(text, values);
    return result.rows;
}

async function getInvoiceByEID(inp){
    const text = 'SELECT *\nFROM PE.INVOICE I\nWHERE EID = $1';
    const values = [inp.eid];
    const result = await db.query(text, values);
    return result.rows;

}

async function getMonthlyTotalIncomeByBID(inp){
    const text = 'SELECT SUM(TOTAL)\nFROM PE.INVOICE\nWHERE BID = $1 AND EXTRACT(MONTH FROM DMY) = $2 AND EXTRACT(YEAR FROM DMY) = $3';
    const values = [inp.bid, inp.month, inp.year];
    const result = await db.query(text, values);
    return result.rows;

}

async function getAnnualTotalIncomeByBID(inp){
    const text = 'SELECT SUM(TOTAL)\nFROM PE.INVOICE\nWHERE BID = $1 AND EXTRACT(YEAR FROM DMY) = $2';
    const values = [inp.bid, inp.year];
    const result = await db.query(text, values);
    return result.rows;

}

async function getAnnualTotalIncomeWithoutBID(inp){
    const text = 'SELECT SUM(TOTAL)\nFROM PE.INVOICE\nWHERE EXTRACT(YEAR FROM DMY) = $1';
    const values = [inp.year];
    const result = await db.query(text, values);
    return result.rows;

}

async function getMonthlyTotalIncomeWithoutBID(inp){
    const text = 'SELECT SUM(TOTAL)\nFROM PE.INVOICE\nWHERE EXTRACT(MONTH FROM DMY) = $1';
    const values = [inp.month];
    const result = await db.query(text, values);
    return result.rows;

}

async function createInvoiceWithoutIID(inp){
    const text = 'INSERT INTO PE.INVOICE(IID, EID, BID, DMY, TOTAL)\nVALUES(DEFAULT, $1, $2, $3, $4)\nRETURNING IID';
    const values = [inp.eid, inp.bid, inp.dmy, inp.total];
    const result = await db.query(text, values);
    return result.rows;

}

async function updateInvoiceByIID(inp){
    const text = 'UPDATE PE.INVOICE\nSET EID = $2, BID = $3, DMY = $4, TOTAL = $5\nWHERE IID = $1';
    const values = [inp.iid, inp.eid, inp.bid, inp.dmy, inp.total];
    await db.query(text, values);
}

async function deleteInvoiceByIID(inp){
    const text = 'DELETE FROM PE.INVOICE\nWHERE IID = $1';
    const values = [inp.iid];
    await db.query(text, values);
}

const input = require('./input.json');
// getMonthlyTotalIncomeByBID(input);
// getAnnualTotalIncomeByBID(input);
// getMonthlyTotalIncomeWithoutBID(input);
// getAnnualTotalIncomeWithoutBID(input);
// getInvoiceByBID({bid: 1});
// getInvoiceByEID(input);
// updateInvoiceByIID(input);
// getInvoiceByDMY(input);
// getInvoiceByBIDDMY(input);

module.exports = {
    getInvoiceByDMY,
    getInvoiceByBIDDMY,
    getAnnualTotalIncomeByBID,
    getAnnualTotalIncomeWithoutBID,
    getInvoiceByEID,
    getInvoiceByBID,
    getMonthlyTotalIncomeByBID,
    getMonthlyTotalIncomeWithoutBID,
    createInvoiceWithoutIID,
    updateInvoiceByIID,
    deleteInvoiceByIID,
}