const { assert } = require('chai');
const chai = require('chai');
const { beforeEach, before } = require('mocha');
const axios = require('axios').default;
const config = require('../../config');
const jwt = require('jsonwebtoken');
// routine number 2:
/*
Manager B go to website and  log in, then:
- proceed to the homepage,which contains:
    - revenue of branch on the top left, top 5 drugs bottom left (GET /revenue)
    - list of employees in the branch on the right (GET / employee/ in a branch)

- he go back to employee list and click delete on a random employee ( DELETE /employee/id)
- he also update info of an employee. (UPDATE employee/), after the  delete, he may try to update it again
- he add a new memeber to the branch, with name,email,address information (POST /employee)
    - that member will receive an email with provided username and password
- click on stock session to check a list of drugs with stock numbers ( GET /drug in a branch ID)
- he click on a drugs that seems to run low, then click restock, then send POST request with medicine id and stock number

- he request branch info with this ID and expect to see info of a branch: where he get:
    - sales report (another get request)
    - address
    - manager ID
- he can from then proceed to request info of the branch's manager
- Do we have a logout endpoint? Not yet
*/
axios.defaults.baseURL="http://"+config.hostname+`:${config.PORT}`;
describe('Manager routine', () => {
    const userID = "1";
    const password = "123";
    const name = 'someslave';
    const mail = 'slave@gmail.com';
    const role = 'EMP';
    describe('log in company website', () => {
        var loginReq;
        beforeEach(() => {
            loginReq = {
                method: 'post',
                url: '/login',
                data: {
                    username: userID,
                    password: password
                },
                responseType: 'json'
            }
        });
        /*
        it('try to log in without password',()=>{
            loginReq.data.password= '';
            // let response =2 ;
            return axios(loginReq).catch((err)=>{
                assert(err.response.status==422,'there should not be internal error nor 200 code');
            });   

        })
        it('try to log in without username',()=>{
            loginReq.data.username='';
            return axios(loginReq).catch((err)=>{
                console.log(err.response.data);
                assert(err.response.status==422,'there should not be internal error nor 200 code');
            });   
        })
        it('try to log in without both',async()=>{
            loginReq.data={};
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
            } catch (error) {
                assert(error.response.status == 403, `response status should be 403`);
            } 
            assert(resp.status==403);
        })
        it('try to log in with some escape character',async()=>{
            loginReq.data.password='\samplepassword';
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
            } catch (error) {
                assert(error.response.status == 403, `response status should be 403`);
            } 
            assert(resp.status==403);
        })
        it('try to log in with incorrect credential',async()=>{
            loginReq.data.password='wrong password OR 1=1';
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
            } catch (error) {
                assert(error.response.status == 403, `response status should be 403`);
            } 
            assert(resp.status==403);
        })
        it('try to log in with correct credential',async()=>{
            console.log("login",loginReq);
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
            } catch (error) {
                assert(error.response.status == 500, `response status should be 200`);
            } 
            assert(resp.status==200, `response status should be 200`);
            const payload= jwt.decode(response.data);
            assert(payload.role=='CEO');
        })*/
    })
    describe('after login', () => {
        var reqWithToken;
        beforeEach(async () => {
            const response = await axios({
                method: 'post',
                url: '/login',
                data: {
                    username: userID,
                    password: password
                },
                responseType: 'json'
            });
            const token = response.headers.token;
            reqWithToken = {
                method: '',
                url: '',
                headers: {
                    token: token
                },
                data: {},
                params: {},
                responseType: 'json'
            }
        });
        describe('list revenue of their branch', () => {
            it('should fail without token', async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                reqWithoutToken.method = "get";
                reqWithoutToken.url = "/revenue";

                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }               
        
                assert(resp.status == 401);
            })
            it('should fail without month or year', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/revenue';
                reqWithToken.params = {
                    BID: 1,
                    month: undefined,
                    year: 2020
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    BID: 1,
                    month: 1,
                    year: undefined
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status == 404); /////////
            })
            it('should fail if month or year or BID is out of range', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/revenue';
                reqWithToken.params = {
                    BID: 1000,
                    month: 1,
                    year: 2020
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }               
                assert(resp.status == 422);

                reqWithToken.params = {
                    BID: 1,
                    month: 13,
                    year: 2020
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }               
                assert(resp.status == 422);

                reqWithToken.params = {
                    BID: 1,
                    month: 1,
                    year: 10000
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }               
                assert(resp.status == 422);
            })
            it('should fail without BID and role is not CEO', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/revenue';
                reqWithToken.params = {
                    BID: undefined,
                    month: 1,
                    year: 2020
                };
                assert(reqWithToken.token.role = 'CEO');
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status == 404); /////////
            })
            it('should show revenue of their branch if token, BID, month and year is provided', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/revenue';
                reqWithToken.params = {
                    BID: 1,
                    month: 1,
                    year: 2020
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }               
                assert(resp.status == 200);
            })
        })
        describe('list top drugs of their branch', () => {
            it('should fail without token', async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.method = "GET";
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithoutToken);
                } catch (error) {
                    console.log(error.response.status);
                    assert(error.response.status == 401, `response status should be 401`);
                }               
                
            })
            it('should fail without month or year or bid', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: undefined,
                    month: undefined,
                    year: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404) /////////
            })
            it('should show top drugs of their branch if token, branchID, month, year is provided', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: 1,
                    month: 1,
                    year: 2020
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }               
                
                assert(resp.status == 200);
            })
        })
        describe('list employees in their branch', () => {
            it('should fail without token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                reqWithToken.branchID = 1;
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }               
                assert(resp.status == 401);
            })
            it('should fail if BID is not defined', async() => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    BID: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if BID is out of range', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    BID: 1000
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }               
                
                assert(resp.status == 422);
            })
            it('should list all employees in their branch', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    BID: 1
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }               
                
                assert(resp.status == 200);

            })
        })

        describe('delete an employee in their branch', () => {
            it('should fail without token', async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                reqWithoutToken.params = {
                    eid: 50
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }
                assert(resp.status == 401);
            })
            it('should fail without EID', async () => {
                reqWithToken.method = 'delete';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               

                assert(resp.status == 404); /////////
            })
            it('should fail if role is not MGR', async () => {
                reqWithToken.method = 'delete';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50
                }; // Just a random number
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if EID = 1 (CEO)', async () => {
                reqWithToken.method = 'delete';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 1
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status = 404) /////////
            })
            it('should fail if EID is not in the same branch', async () => {
                // Create a database with a BID:1 has 3 employees with EID: 1,2,3
                // Create a database with a BID:2 has 3 employees with EID: 4,5,6
                //EID:4 is the manager of BID:2
            }) 

            it('should delete the employee with ID = EID', async () => {
                reqWithToken.method = 'delete';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50
                }; // Just a random number
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }               
                assert(resp.status == 200);
            })
        })
        describe('update an account in their branch', () => {
            it('should fail without token', async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }               
                
                assert(resp.status == 401);
            })
            it('should fail without EID', async () => {
                reqWithToken.method = 'put';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: undefined,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail without password', async () => {
                reqWithToken.method = 'put';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50,
                    pass: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if role is not MGR', async () => {
                reqWithToken.method = 'put';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50,
                    pass: password
                }; // Just a random number
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if EID = 1 (CEO)',async () => {
                reqWithToken.method = 'put';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 1,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status = 404) /////////
            })
            it('should update employee with ID = EID account',async () => {
                reqWithToken.method = 'put';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status = 404); /////////
            })
        })
        describe('add a new account to their branch', () => {
            it('should fail without token',async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }               
                
                assert(resp.status == 401);
            })
            it('should fail if one of the parameters are not provided',async () => {
                reqWithToken.method = 'post';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    ename: undefined,
                    mail: mail,
                    erole: role,
                    bid: 1,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: undefined,
                    erole: role,
                    bid: 1,
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: undefined,
                    bid: 1,
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: role,
                    bid: undefined,
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: role,
                    bid: 1,
                    pass: undefined
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if role is not MGR', async() => {
                reqWithToken.method = 'delete';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    eid: 50
                }; // Just a random number
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if the provided parameters in the wrong format',async () => {
                reqWithToken.method = 'post';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    ename: "123", //failed ename
                    mail: mail,
                    erole: role,
                    bid: 1,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: "345", //failed mail
                    erole: role,
                    bid: 1,
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: "a", //failed erole
                    bid: 1,
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: role,
                    bid: -1, //failed bid
                    pass: password
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: role,
                    bid: 1,
                    pass: undefined // failed pass
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            
            it('should add new account when all parameters are provided',async () => {
                reqWithToken.method = 'post';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    ename: name,
                    mail: mail,
                    erole: role,
                    bid: 1,
                    pass: password
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }               
                assert(resp.status == 200);
            })
        })
        describe('list stocks of their branch', () => {
            it('should fail without token', async() => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }               
                
                assert(resp.status == 401);
            })
            it('should fail without BID', async() => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                
                assert(resp.status == 404); /////////
            })
            it('should fail if BID is out of range or not their branch',async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: 1000
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }                   
                assert(resp.status == 422);
                reqWithToken.params = {
                    branchID: 2
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }                   
                assert(resp.status == 404); /////////
            })
            it('should list the current stock of their branch',async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: 1
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }                   
                assert(resp.status == 200);
            })
        })
        describe('add stock to their branch stock', () => {
            it('should fail without token', async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }   
                assert(resp.status == 401);
            })
            it('should fail without BID, DID or quantity', async() => {
                reqWithToken.method = 'post';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: undefined,
                    drugID: 1,
                    quantity: 1000
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }   
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    branchID: 1,
                    drugID: undefined,
                    quantity: 1000
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }   
                assert(resp.status == 404); /////////
                reqWithToken.params = {
                    branchID: 1,
                    drugID: 1,
                    quantity: undefined
                };
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }                  
                 assert(resp.status == 404); /////////
            })
            it('should fail if BID is out of range or not their branch; DID is out of range', async() => {
                    reqWithToken.method = 'post';
                    reqWithToken.url = '/drugs';
                    reqWithToken.params = {
                        branchID: 1000,
                        drugID: 1,
                        quantity: 1000
                    };
                    let resp;
                    try {
                        resp = await axios(reqWithToken);
                    } catch (error) {
                        assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                    }                       
                    assert(resp.status == 422);
                    reqWithToken.params = {
                        branchID: 2,
                        drugID: 1,
                        quantity: 1000
                    };
                    try {
                        resp = await axios(reqWithToken);
                    } catch (error) {
                        assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                    }                       
                    assert(resp.status == 404); /////////
                    // Out of range
                    reqWithToken.params = {
                        branchID: 1,
                        drugID: 1000,
                        quantity: 1000
                    };
                    try {
                        resp = await axios(reqWithToken);
                    } catch (error) {
                        assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                    }                       
                    assert(resp.status == 422);
                })
            it('should add/update stock in branch', async() => {
                reqWithToken.method = 'post';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    branchID: 1,
                    drugID: 1,
                    quantity: 1000
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }   
                assert(resp.status == 422);
            })
        })
        describe('get branch information', () => {
            it('should fail without token', async() => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }   
                assert(resp.status == 401);
            })
            it('should fail if branchID is not defined and role is MGR',async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.params = {
                    branchID: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }   
                assert(resp.status == 404); /////////
            })
            it('should fail if branchID is out of range', async() => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.params = {
                    branchID: 1000
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }   
                assert(resp.status == 422); /////////
            })
            it('should get branch information', async() => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.params = {
                    branchID: 1
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }   
                assert(resp.status == 200);
            })
        })
        describe('get branch manager information', () => {
            it('should fail without token',async () => {
                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 401, `response status should be 401`);
                }   
                assert(resp.status == 401);
            })
            it('should fail if id is not defined',async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    id: undefined
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }   
                assert(resp.status == 404); /////////
            })
            it('should fail if input is not integer',async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    id: 'a'
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 422`);
                }   
                assert(resp.status == 422); /////////
            })
            it('should show branch manager information', async() => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    id: 1
                };
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                }   
                assert(resp.status == 200);
            })
        })
    })
})