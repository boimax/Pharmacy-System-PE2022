exports.mochaGlobalSetup =  ()=>{
    this.server = require("../../server.js");
}


exports.mochaGlobalTeardown = async ()=>{
    await this.server.close();
}