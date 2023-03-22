const db = require('./db');

async function getEmployeeByEID(inp){
    const text = 'SELECT *\nFROM PE.EMPLOYEE\nWHERE EID = $1';
    const values = [inp.eid];
    const result = await db.query(text, values);
    return result.rows;

}
async function getAllEmployee()
{
    const text = 'SELECT *\nFROM PE.EMPLOYEE';
    const result = await db.query(text);
    return result.rows;
}
async function getEmployeeByBID(inp){
    const text = 'SELECT *\nFROM PE.EMPLOYEE\nWHERE BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;
 
}

async function getEmployeeRoleByEID(inp){
    const text = 'SELECT EROLE\nFROM PE.EMPLOYEE\nWHERE EID = $1';
    const values = [inp.eid];
    const result = await db.query(text, values);
    return result.rows;
    
}

async function getEmployeeMailByEID(inp){
    const text = 'SELECT MAIL\nFROM PE.EMPLOYEE\nWHERE EID = $1';
    const values = [inp.eid];
    const result = await db.query(text, values);
    return result.rows;

}

async function getEmployeeMailByBID(inp){
    const text = 'SELECT MAIL\nFROM PE.EMPLOYEE\nWHERE BID = $1';
    const values = [inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}

async function createEmployeeWithoutEID(inp){
    const text = 'INSERT INTO PE.EMPLOYEE(EID, ENAME, MAIL, EROLE, BID)\nVALUES(DEFAULT, $1, $2, $3, $4)\nRETURNING EID';
    const values = [inp.ename, inp.mail, inp.erole, inp.bid];
    const result = await db.query(text, values);
    return result.rows;

}


async function updateEmployeeByEID(inp){
    const text = 'UPDATE PE.EMPLOYEE\nSET ENAME = $2, MAIL = $3, EROLE = $4, BID = $5\nWHERE EID = $1';
    const values = [inp.eid, inp.ename, inp.mail, inp.erole, inp.bid];
    await db.query(text, values);    
}

async function deleteEmployeeByEID(inp){
    const text = 'DELETE FROM PE.EMPLOYEE\nWHERE EID = $1';
    const values = [inp.eid];
    await db.query(text, values);
}

const input = require('./input.json');
// createEmployeeWithoutEID(input);
// deleteEmployeeByEID(input);
// updateEmployeeByEID(input);
// getEmployeeByBID(input);
// getEmployeeByEID(input);
// getEmployeeMailByEID(input);
// getEmployeeRoleByEID(input);
module.exports = {
    createEmployeeWithoutEID,
    deleteEmployeeByEID,
    getEmployeeByBID,
    getEmployeeByEID,
    getEmployeeMailByEID,
    getEmployeeMailByBID,
    updateEmployeeByEID,
    getEmployeeRoleByEID,
    getAllEmployee
}