const db = require("./db");

async function getAccountByEID(inp) {
  const text = "SELECT *\nFROM PE.ACCOUNT\nWHERE EID = $1";
  const values = [inp.eid];
  const result = await db.query(text, values);
  return result.rows;
}

async function createAccountWithEID(inp) {
  const text = "INSERT INTO PE.ACCOUNT(EID, PASS, URL)\nVALUES($1, $2, $3)";
  const values = [inp.eid, inp.pass, inp.url];
  await db.query(text, values);
}

async function updateAccountByEID(inp) {
  const text = "UPDATE PE.ACCOUNT\nSET PASS = $2, URL = $3\nWHERE EID = $1";
  const values = [inp.eid, inp.pass, inp.url];

  await db.query(text, values);
}

async function deleteAccountByEID(inp) {
  const text = "DELETE FROM PE.ACCOUNT\nWHERE EID = $1";
  const values = [inp.eid];

  await db.query(text, values);
}

const input = require('./input.json');
// createAccountWithEID(input);
// deleteAccountByEID(input);
// const a=await getAccountByEID({eid:1});
// (async () => {
//   console.log(await getAccountByEID({ eid: 1 }));
// })();
// updateAccountByEID(input);

module.exports = {
  createAccountWithEID,
  deleteAccountByEID,
  getAccountByEID,
  updateAccountByEID,
};
