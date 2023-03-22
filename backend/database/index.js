const emp = require('./employee');
const acc = require('./account');
const bra = require('./branch');
const dru = require('./drug');
const inv = require('./invoice');
const pre = require('./prescription');
const sto = require('./stock');

const exp = {};
const libs = [emp, acc, bra, dru, inv, pre, sto]
libs.forEach(element => {
    Object.keys(element).forEach(key=>{
        exp[key]= element[key];
    })
});
// console.log(libs,exp);


module.exports = {emp, acc, bra, dru, inv, pre, sto};
