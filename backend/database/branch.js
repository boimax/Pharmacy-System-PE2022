const db = require('./db');

async function getBranchByBID(inp) {
    const text = 'SELECT *\nFROM PE.BRANCH\nWHERE BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}

async function getAllBranches() {
    const text = 'SELECT *\nFROM PE.BRANCH';
    const result = await db.query(text);
    return result.rows;
}

async function getBranchManagerByBID(inp) {
    const text = 'SELECT MGRID\nFROM PE.BRANCH\nWHERE BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}

async function createBranchWithoutBID(inp) {
    const text = 'INSERT INTO PE.BRANCH(BID, BNAME, ADDR, MGRID)\nVALUES(DEFAULT, $1, $2, $3)\nRETURNING BID';
    const values = [inp.bname, inp.addr, inp.mgrid];
    const result = await db.query(text, values);
    return result.rows;
}

async function updateBranchByBID(inp) {
    const text = 'UPDATE PE.BRANCH\nSET BNAME = $2, ADDR = $3, MGRID = $4\nWHERE BID = $1';
    const values = [inp.bid, inp.bname, inp.addr, inp.mgrid];
    await db.query(text, values);
}

async function deleteBranchByBID(inp) {
    const text = 'DELETE FROM PE.BRANCH\nWHERE BID = $1';
    const values = [inp.bid];
    await db.query(text, values);
}

const input = require('./input.json');
// createBranchWithoutBID(input);
// updateBranchByBID(input);
// getAllBranches();
// getBranchByBID(input);
// getBranchManagerByBID(input);
// deleteBranchByBID(input);
module.exports = {
    createBranchWithoutBID,
    updateBranchByBID,
    getAllBranches,
    getBranchByBID,
    getBranchManagerByBID,
    deleteBranchByBID,
}