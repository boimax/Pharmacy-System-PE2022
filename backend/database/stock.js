const db = require('./db');

async function getStockWithBID(inp){
    const text = 'SELECT *\nFROM PE.STOCK S NATURAL JOIN PE.DRUG D\nWHERE S.BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}

async function getStockQNTWithIDs(inp){
    const text = 'SELECT QNT\nFROM PE.STOCK\nWHERE BID = $1 AND DID = $2';
    const values = [inp.bid, inp.did];
    const result = await db.query(text, values);
    return result.rows;
}

async function createStockWithIDs(inp){
    const text = 'INSERT INTO PE.STOCK(BID, DID, QNT)\nVALUES($1, $2, $3)';
    const values = [inp.bid, inp.did, inp.qnt];
    await db.query(text, values);
}

async function updateStockWithIDs(inp){
    const text = 'UPDATE PE.STOCK\nSET QNT = $3\nWHERE BID = $1 AND DID = $2';
    const values = [inp.bid, inp.did, inp.qnt];
    console.log(values)
    await db.query(text, values);
}

async function addStockWithIDs(inp){
    const text = 'UPDATE PE.STOCK\nSET QNT =QNT+$3\nWHERE BID = $1 AND DID = $2';
    const values = [inp.bid, inp.did, inp.qnt];
    console.log(values)
    await db.query(text, values);
}

async function deleteStockWithIDs(inp){
    const text = 'DELETE FROM PE.STOCK\nWHERE BID = $1 AND DID = $2';
    const values = [inp.bid, inp.did];
    await db.query(text, values);
}

const input = require('./input.json');
// createStockWithIDs(input);
// getStockQNTWithIDs(input);
// updateStockWithIDs(input);
// getStockWithBID(input);
// deleteStockWithIDs(input);

module.exports = {
    createStockWithIDs,
    getStockQNTWithIDs,
    getStockWithBID,
    updateStockWithIDs,
    getStockQNTWithIDs,
    deleteStockWithIDs,
    addStockWithIDs,
}