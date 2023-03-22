// What this test should do:
// build up an server instance, including database also
// Populate database with: 1 CEO, 3 branches with 3 manager for each branches
// populate sample drug database
// what can this CEO do?
// send routine http request

const { assert } = require('chai');
const chai = require('chai');
const { beforeEach, before } = require('mocha');
const axios = require('axios').default;
const config = require('../../config');
const jwt = require('jsonwebtoken');

// routine1:
/*
CEO A log into the company, and
- view a list of medicine,
- go back and click on branches, where he can see a list of branches names(with ID)
- he request branch info with this ID and expect to see info of a branch: where he get:
    - sales report (another get request to the /revenue, but with branch ID i guess)
    - address
    - manager ID
- he can from then proceed to request info of the branch's manager

-he can then go back to dashboard and see a fucking revenue and financial bullshitery graph (by calling a get to /revenue endpoint)
- if he is satisfied after only watching and contributing nothing to this business, he can then log out by pressing a large red button
- Do we have a logout endpoint? Not yet
*/
axios.defaults.baseURL="http://"+config.hostname+`:${config.PORT}`;
describe('CEO routine', () => {
    const userID = "1";
    const password = "123";
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
                assert(error.response.status == 422, `response status should be 422`);
            } 
            assert(response.status==422);
        })
        it('try to log in with some escape character',async()=>{
            loginReq.data.password='\samplepassword';
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
            } catch (error) {
                assert(error.response.status == 401, `response status should be 401`);
            } 
            assert(resp.status==401);
        })
        it('try to log in with incorrect credential',async()=>{
            loginReq.data.password='wrong password OR 1=1';
            //var response = await axios(loginReq);
            let resp;
            try {
                resp = await axios(loginReq);
                console.log(response);
            } catch (error) {
                assert(error.response.status == 401, `response status should be 401`);
            } 
            assert(resp.status==401);
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
        })
    })

    describe('after login', () => {
        var reqWithToken;
        beforeEach(async () => {
            let resp;
                try {
                    resp = await axios({
                        method: 'post',
                        url: '/login',
                        data: {
                            username: "2",
                            password: "qwe"
                        },
                        responseType: 'json'  
                    });
                    const token = resp.headers.token;
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
                } catch (error) {
                    console.error(error)
                } 

        });
        describe('list of branches GET endpoint', () => { //branches
            it('should fail without token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status==400, `response status should be 400`);
                } 
                assert(resp.status == 200);
                assert(resp.data.length == 3); // there should be an array with 3? elements, idk

                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(response.status == 500, `with input ${key}=${elem},response status should be 404`);
                }               
                assert(resp.status == 404);
            })
            it('should show branches list if we provide token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status==500, `response status should be 500`);
                } 
                assert(resp.status == 200);
                assert(resp.data.length == 3); // there should be an array with 3? elements, idk
            })
        })
        describe('list of medicine GET endpoint', () => { //medicine
            it('should fail without token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                } 
                assert(resp.status == 200);

                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 401`);
                } 
                assert(resp.status == 401);
            })
            it('should show medicine stock of a branch if we provide token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.param = {
                    "branchID": 1
                } //example
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                } 
                assert(resp.status == 200);

            })
            it('should show medicine stock of a branch if we provide token and non-existent branch', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/drugs';
                reqWithToken.params = {
                    "branchID": 1000
                } //example
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                } 
                assert(resp.status == 404);
            })
        })
        describe('request branch info with a particular ID', () => { //branch info
            it('should fail without token and succeed with token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.params = {
                    "branchID": 1
                } //example 
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                } 
                assert(resp.status == 200);

                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 401`);
                } 
                assert(resp.status == 401);
            })
            it('should fail if the branch ID does not exist', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.branchID = 1000;
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 401`);
                } 
                assert(resp.status == 401);
            })
            it('should open if the branch ID exist', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/branch';
                reqWithToken.params = {
                    "branchID": 1
                } //example 
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                } 
                assert(resp.status == 200);
            })
        })
        describe('request manager info with a particular ID', () => { //manager info
            it('should fail without token and succeed with token', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 200`);
                } 
                assert(resp.status == 200);

                var reqWithoutToken = reqWithToken;
                reqWithoutToken.headers = {};
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 401`);
                } 
                assert(resp.status == 401);
            })
            it('should fail if the manager ID does not exist', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.branchID = 1000;
                let resp;
                try {
                    resp = await axios(reqWithToken);
                } catch (error) {
                    assert(error.response.status == 500, `with input ${key}=${elem},response status should be 404`);
                } 
                assert(resp.status == 404);
            })
            it('should open if the manager ID exist', async () => {
                reqWithToken.method = 'get';
                reqWithToken.url = '/employee';
                reqWithToken.params = {
                    "branchID": 1
                }
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