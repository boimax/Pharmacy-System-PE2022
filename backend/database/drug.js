const db = require('./db');

async function getDrugByDID(inp){
    const text = 'SELECT *\nFROM PE.DRUG\nWHERE DID = $1';
    const values = [inp.did];
    const result = await db.query(text, values);
    return result.rows;

}

async function getDrugByDName(inp){
    const text = 'SELECT DID\nFROM PE.DRUG\nWHERE DNAME = $1';
    const values = [inp.dname];
    const result = await db.query(text, values);
    return result.rows;

}

async function getDrugPriceByDID(inp){
    const text = 'SELECT PRICE\nFROM PE.DRUG\nWHERE DID = $1';
    const values = [inp.did];
    const result = await db.query(text, values);
    return result.rows;

}

async function createDrugWithoutDID(inp){
    const text = 'INSERT INTO PE.DRUG(DID, DNAME, PRICE, URL)\nVALUES(DEFAULT, $1, $2, DEFAULT)\nRETURNING DID';
    const values = [inp.dname, inp.price];
    const result = await db.query(text, values);
    return result.rows;

}

async function deleteDrugByDID(inp){
    const text = 'DELETE FROM PE.DRUG\nWHERE DID = $1';
    const values = [inp.did];
    await db.query(text, values);
}

const input = require('./input.json');
// createDrugWithoutDID(input);
// getDrugByDID(input);
// getDrugPriceByDID(input);
// deleteDrugByDID(input);

module.exports = {
    getDrugPriceByDID,
    createDrugWithoutDID,
    getDrugByDID,
    getDrugByDName,
    deleteDrugByDID,
}