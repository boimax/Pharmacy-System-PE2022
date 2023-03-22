const { assert } = require('chai');
const chai = require('chai');
//const {response} = require('express');
const { beforeEach, before } = require('mocha');
const axios = require('axios').default;
const config = require('../../config');
const jwt = require('jsonwebtoken');
/*
routine 3:
- employee see the dashboard
- employee navigate to chat tab, which will redirect him to a chat page, where he will find another employee by his ID and chat with him
	- check here if he can go into chat without token

- employee go back and navigate to bill tab on the dashboard, where he will:
	- send the bill to the server ( try adding bills with incorrect information here to see if server will crash)
*/

axios.defaults.baseURL="http://"+config.hostname+`:${config.PORT}`;


describe('after login',()=>{
        var reqWithToken;
        beforeEach(async ()=>{
            console.log("called");
            const response = await axios({
                method: 'post',
                url: '/login',
                data: {username:"2",password:"qwe"},
                responseType:'json'
            });
            const token = response.data;
            reqWithToken = {
                // method: '',
                // url: '',
                headers: {"Authorization":"Bearer "+token},
                data: {},
                params:{},
                responseType:'json'
            }
        });
        describe('bill POST endpoint',()=>{
            let invalidEid = [-1,"a",undefined,"",2.5]
            let invalidBid = [-1,"a",undefined,"",2.5]
            let invalidDMY = [-1,"random string",undefined,"",2.5,"2",3,"01/22"]
            let invalidDrugSold = [[{}],[{"drugID":3}],[{"qnt":20}],[{"drugID":2.4,qnt:30}],[{"drugID":2,qnt:30.3}],[{"drugID":"hay",qnt:30}]]
            let body;
            beforeEach(async ()=>{
                body = {
                    "eid": 1,
                    "bid":1,
                    "drugList": [
                        {
                            "drugID": 2,
                            "qnt": 30
                        },
                        {
                            "drugID": 1,
                            "qnt": 20
                        }
                    ],
                    "dmy":"29/01/2022",
                    "total":50
                };
            })

            // make a drug list
            // make a total amount
            let runBatchRequest = async (arrInput,key)=>{
                for (let index = 0; index < arrInput.length; index++) {
                    const elem = arrInput[index];
                    body[key] = elem;
                    reqWithToken.data = body;
                    console.log("reqWithToken",reqWithToken);
                    try {
                        let response = await axios(reqWithToken);
                    } catch (error) {
                        // console.log("error fucking me",error.response.data);
                        assert(error.response.status == 422,`with input ${key}=${elem},response status should be 422`);
                    }
                }
            }
            it('should be successful, if given the default input',async()=>{
                reqWithToken.method="post"
                reqWithToken.url="/bill";
                reqWithToken.data = body;
                console.log("test body",reqWithToken.data);
                let response =await axios(reqWithToken).catch((err)=>{
                    console.log("error fucking me",err.response.data);
                    assert(err.response.status == 200,"it should be successful with normal input");
                });                
            })
            it('should fail, if there is not enough stock',async()=>{
                reqWithToken.method="post"
                reqWithToken.url="/bill";
                reqWithToken.data = body;
                reqWithToken.data.drugList[0].qnt=200;
                reqWithToken.data.drugList[1].qnt=200;
                response = await axios(reqWithToken).catch((err)=>{
                    console.error("err",err);
                    assert(err.response.status == 400,"it should fail if there is not enough stock");/////
                });
            })
            describe('test sanitization', ()=>{
                beforeEach(()=>{
                    reqWithToken.method="post";
                    reqWithToken.url="/bill";
                })
                it("should fail if bid is invalid",async()=>{
                    await runBatchRequest(invalidBid,"bid");
                })
                it("should fail if bid is invalid",async()=>{
                    await runBatchRequest(invalidEid,"eid");
                })
                it("should fail if bid is invalid",async()=>{
                    await runBatchRequest(invalidDMY,"dmy");
                })
                it("should fail if bid is invalid",async()=>{
                    console.log("body",body);
                    await runBatchRequest(invalidDrugSold,"drugList");
                })
            })
        })
});


        // describe('employee routine',()=>{
        //         // client.query();
        //         const userID= "1";
        //         const password= "123";
        //         var loginReq;
        //         var response;
        //         beforeEach(async ()=>{
        //             loginReq = {
        //                 method: 'post',
        //                 url: '/login',
        //                 data: {username:userID,password:password},
        //                 responseType:'json'
        //             }
        //         });
                
        //         it('try to log in without password',()=>{
        //             loginReq.data.password= '';
        //             // let response =2 ;
        //             return axios(loginReq).catch((err)=>{
        //                 assert(err.response.status==422,'there should not be internal error nor 200 code');
        //             });   
        
        //         })
        //         it('try to log in without username',()=>{
        //             loginReq.data.username='';
        //             return axios(loginReq).catch((err)=>{
        //                 console.log(err.response.data);
        //                 assert(err.response.status==422,'there should not be internal error nor 200 code');
        //             });   
        //         })
        //         it('try to log in without both',async()=>{
        //             loginReq.data={};
        //             var response = await axios(loginReq);
        //             assert(response.status==403);
        //         })
        //         it('try to log in with some escape character',async()=>{
        //             loginReq.data.password='\samplepassword';
        //             var response = await axios(loginReq);
        //             assert(response.status==403);
        //         })
        //         it('try to log in with incorrect credential',async()=>{
        //             loginReq.data.password='wrong password OR 1=1';
        //             var response = await axios(loginReq);
        //             assert(response.status==403);
        //         })
        //         it('try to log in with correct credential',async()=>{
        //             console.log("login",loginReq);
        //             var response = await axios(loginReq);
        //             assert(response.status==200);
        //             const payload= jwt.decode(response.data);
        //             assert(payload.role=='CEO');
        //         })
        //     })