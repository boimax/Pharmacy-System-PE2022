# Project: Pharmacy Management System

## Introduction
Medication has been an important part of human beings since people are more and more aware of our health, and big pharmacy companies are constantly providing us with their best medicines to support our demands. Therefore, an effective pharmaceutical store management application is needed to make the process of managing the sales of medicines faster and more convenient. As a result, the "Tiem Thuoc Gia Dinh" project was created to provide a web-based platform to meet that demand.



## Objective
This final report for the Programming Exercise Project, "Tiem Thuoc Gia Dinh", is submitted to partially satisfy the requirements of the Programming Exercise course at Vietnamese-German University. Moreover, our goal is to realize "Tiem Thuoc Gia Dinh" as a usable application for pharmaceutical companies to manage their products.

The platform is designed to be used by the 3 main roles of a big-chain company (CEO, Branch Manager, Pharmacist):
- CEO is in charge of the organization and is able to see all the statistics of the company (revenue, drug sales, ...) and manage all the branch managers.
- Each Branch Manager is in charge of one branch. They can see the branch statistics of their branch, refill the stock of medical drugs and manage their employee.
- Pharmacists can add new invoices and view the available stock of medical drugs.
- Furthermore, a built-in chat application for easier communication between pharmacists and managers was also integrated into the platform.

## Acknowledgements
+ Le Dinh Chuong (15983), gitlab: @comrang-altf4
+ Ngo Quang Minh (16254), gitlab: @bap-rang
+ Nguyen Duc Thang (15656), gitlab: @hardcoresummer
+ Le Nang Tan (16000), gitlab: @tanln123
+ To Quang Huy (15638), gitlab: @chinezeboi-08
+ Nguyen Khoa (15705), gitlab: @neko941
+ Hoang Minh Duc (16577), gitlab: @duck2913
+ Ho Cat Tuong (15996), gitlab: @boimax
+ Doan Tan Sang (16025), gitlab: @FrostJ143

| Task                  | Chuong | Minh | Thang | Tan | Huy | Khoa | Duc | Tuong | Sang |
| :-------------------- | :----: | :--: | :---: | :-: | :-: | :--: | :-: | :---: | :--: |
| Application Structure | x      | x    | x     | x   | x   | x    | x   | x     | x    |
| Prepare documentation | x      | x    | x     | x   | x   | x    | x   | x     | x    | 
| Prepare slides        | x      | x    | x     | x   | x   | x    | x   | x     | x    | 
| Prepare diagrams      | x      | x    | x     | x   | x   | x    | x   | x     | x    |
| Frontend              |        | x    |       | x   |     | x    | x   |       | x    |
| Backend (Server)      | x      |      | x     |     | x   |      |     |       |      | 
| Backend (Routes)      | x      |      | x     |     | x   |      |     |       |      | 
| Backend (Database)    | x      |      | x     |     | x   |      |     |       |      | 
| Chat                  |        |  x   |       |     |     |      |     |       |  x   | 
| DevOps                |        |      |       |     |     |      |     | x     |      |
    

## Designing the system
### System analysis
#### 1. Usecase diagrams
<p align="center">
  <img src="https://i.imgur.com/Nr0YnOy.png" />
</p>
<p style="text-align: center;"> <i>Figure 1.1: Use Case Diagram for CEO</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/2bORCmp.png" />
</p>
<p style="text-align: center;"> <i>Figure 1.2: Use Case Diagram for Branch Manager</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/luYXoTt.png" />
</p>
<p style="text-align: center;"> <i>Figure 1.3: Use Case Diagram for Employee</i></p>



#### 2. Activity diagrams
##### 2.1. Login
<p align="center">
  <img src="https://i.imgur.com/glSPysX.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.1: Login Activity Diagram</i></p>

##### 2.2. For CEO
<p align="center">
  <img src="https://i.imgur.com/FwXpoYy.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.2.1: Manage Branches Activity Diagram</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/07EzCg5.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.2.2: View Company Revenue Activity Diagram</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/MDdWcmw.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.2.3: View Medicines Sales Activity Diagram</i></p>

##### 2.3. For Branch Manager
<p align="center">
  <img src="https://i.imgur.com/mySANEY.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.3.1: Manage Employee Activity Diagram</i></p><br>


<p align="center">
  <img src="https://i.imgur.com/g1yfhWh.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.3.2: View Branch Revenue Activity Diagram</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/SakuEw0.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.3.3: View Stock Information Activity Diagram</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/7U8c2c1.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.3.4: Refill Stock Activity Diagram</i></p>

##### 2.4. For Employee
<p align="center">
  <img src="https://i.imgur.com/0kXgkyg.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.4.1: Medicine Order Activity Diagram</i></p><br>

<p align="center">
  <img src="https://i.imgur.com/LodSG6Y.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.4.2: View Stock Information Activity Diagram</i></p><br>

##### 2.5. Chat Feature
<p align="center">
  <img src="https://i.imgur.com/SyIlLvI.png" />
</p>
<p style="text-align: center;"> <i>Figure 2.5: Chat Feature Activity Diagram</i></p>


#### 3. Database design
Two different databases are used for the project: PostgreSQL and MongoDB. Storing business information required a relational structure since the data is tightly coupled, therefore, PostgreSQL is preferred for the task. There are seven tables, naming:
* *EMPLOYEE*: general information of the employees
* *ACCOUNT*: username and password for the website
* *BRANCH*: general information of the branches
* *DRUG*: information of available drugs in the company
* *STOCK*: information of available drugs in a branch
* *INVOICE*: information of issued invoices
* *PRESCRIPTION*: information of the drugs that have been sold in a particular invoice

![](https://i.imgur.com/NMtqzsH.png)
<p style="text-align: center;"> <i>Figure 3.1: Entity Relationship Diagram</i></p>

![](https://i.imgur.com/N0MhdKq.png)
<p style="text-align: center;"> <i>Figure 3.2: Database Relationship Design</i></p>

A set of constraints is provided in order to keep the database's integrity and consistency:
- *fk_emp_bra*: foreign key constraint, referencing *EMPLOYEE.BID* to *BRANCH.BID*; set on delete set null.
- *fk_bra_emp*: foreign key constraint, referencing *BRANCH.MGRID* to *EMPLOYEE.EID*; set on delete restrict.
- *fk_acc_emp*: foreign key constraint, referencing *ACCOUNT.EID* to *EMPLOYEE.EID*; set on delete cascade.
- *fk_sto_bra*: foreign key constraint, referencing *STOCK.BID* to *BRANCH.BID*; set on delete casacade.
- *fk_sto_dru*: foreign key constraint, referencing *STOCK.DID* to *DRUG.DID*; set on delete cascade.
- *fk_inv_emp*: foreign key constraint, referencing *INVOICE.EID* to *EMPLOYEE.EID*; set on delete set null.
- *fk_inv_bra*: foreign key constraint, referencing *INVOICE.BID* to *BRANCH.BID*.
Action for updates is not defined because the IDs are expected to be immutable.

#### 4. System architecture
Our system consist of 10 running server, including databases and a S3 bucket:
-    Five (5) webservers  exposed to client from which the client will get static contents like HTML, CSS for four (4) different website: CEO, Manager, Employee, Chat, Login. (For simplicity we will consider this as only one webserver).
-    A NodeJS API server whom the webserver will call upon to actually perform core actions in our business model, like selling drugs or getting the financial statistic. This server also provides barely minimum authentication via JWT and authorization with RBAC, as we do not have enough time to create our own authentication server.
-    A NodeJS chat server, responsible for managing chat between employees in the company.
-    A remote Postgres server for storing all business related information, an S3 bucket dedicated for storing employee profile pictures and a remote Mongodb database only for storing chat messages between employees.
![](https://i.imgur.com/jpleJuI.png)
<p style="text-align: center;"> <i>Figure 4: Architecture of our system</i></p>

#### 5. Resource
We have deployed every part of our application on different cloud platforms, namely DigitalOcean, Netlify and MongoDB Atlas.
- DigitalOcean provide infrastructure for the API server, the chat server, Postgres database, and an S3 bucket. The reason we chosed this platform is because it is more cost-efective compared to other cloud services, and it offered us 100$ credit for 2 months which is a lot.
- Netlify host all the static contents such as HTML, CSS, Javascripts.
- MongoDB Atlas has given us 1 cluster for storing message history. The free tier is pretty limited as it only provide 500MB storage, but we have not messaged that much.
Below is the table describing the hardware we used to deploy our application:

<table style="width:100%">
    <tr>
        <td rowspan="2"><b>Service</b></td>
        <td rowspan="2"><b>Platform</b></td>
        <td colspan="3"><b>Hardware Specification</b></td>
    </tr>
    <tr>
        <td><b>vCPU</b></td>
        <td><b>RAM</b></td>
        <td><b>Storage</b></td>
    </tr>
    <tr>
        <td>API Server</td>
        <td>DigitalOcean</td>
        <td>1</td>
        <td>1GB</td>
        <td>10GB</td>
    </tr>
    <tr>
        <td>Chat Server</td>
        <td>DigitalOcean</td>
        <td>1</td>
        <td>1GB</td>
        <td>10GB</td>
    </tr>
    <tr>
        <td>Postgres Database</td>
        <td>DigitalOcean</td>
        <td>1</td>
        <td>1GB</td>
        <td>25GB</td>
    </tr>
    <tr>
        <td>MongoDB Shared Cluster</td>
        <td>MongoDB Atlas</td>
        <td>───</td>
        <td>───</td>
        <td>500MB</td>
    </tr>
    <tr>
        <td>Frontend Webserver</td>
        <td>Netlify</td>
        <td>───</td>
        <td>───</td>
        <td>───</td>
    </tr>
</table>


## Implementing the system

### Backend
The backend in our application acts as an API server. It is responsible for handling all requests from the frontend and returning the appropriate data. The backend is written in [javascript](https://www.javascript.com/) with [expressjs](https://expressjs.com/). 
#### 1. Routes
The backend is responsible for handling all requests from the frontend. The following table shows all routes that the API server handle:
| Route               | Method | Description |
| :------------------ |:------:|:----|
| /login              | POST   | get username and password, return login token |
| /drugs              | GET    | get all drugs in a branch|
| /drugs/:id          | GET    | get information of a specific drug|
| /drugs              | POST   | update stock of a drug with specific drugID in a branch|
| /drugs/:year/:month | GET    | get top selling drugs of a branch or the whole company|
| /branches           | GET    | get all branches|
| /branches/:id       | GET    | get information of a specific branch|
| /bill               | POST   | create a bill|
| /drugsale           | GET    | get drugsale of a branch or the whole company specific time period|
| /employee           | GET    | get information of one employee, all employees in a branch or the whole company|
| /employee           | POST   | update information of an employee|
| /employee           | DELETE | delete an employee|
| /employee           | PUT    | create an employee|
| /manager/:bid       | GET    | get information of manager of a branch|
| /revenue            | GET    | get revenue of a branch or the whole company|

#### 2. Server
The server consists of 3 layers: Middleware, Controller, and Database.

![](https://i.imgur.com/Mp8GLfr.png)


<p style="text-align: center;"> <i>Figure 5: Architecture of Server</i></p>

These layers provide different functionalities:
* Middleware: [ExpressJS](https://expressjs.com/) framework is used in order to provide some basic middleware functions. Besides that, some additional ones are also written, for example, error-handling and authorizing.
* Controller: logical processing is handled in this layer, which is also the core of the provided REST APIs.
* Database: this layer includes the remote PostgreSQL database and functions for retrieving data, written in NodeJS.

#### 3. Middlewares
In the backend, the following middlewares are used:
- [body-parser](https://www.npmjs.com/package/body-parser): parse the body of the request
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): parse the cookie of the request
<!-- - [cors](https://www.npmjs.com/package/cors): enable cross-origin resource sharing -->
- [morgan](https://www.npmjs.com/package/morgan): log the request
- [express.json](https://expressjs.com/en/api.html#express.json): parse incoming requests with JSON payloads and is based on body-parser
- [express.text](https://expressjs.com/en/api.html#express.text): parse incoming request payloads into a string and is based on body-parser
- [express.static](https://expressjs.com/en/api.html#express.static): serve static files and is based on [serve-static](https://expressjs.com/en/resources/middleware/serve-static.html)
- [express.urlencoded](https://expressjs.com/en/api.html#express.urlencoded): parse incoming requests with urlencoded payloads and is based on body-parser
- [express-validator](https://express-validator.github.io/docs/index.html): validate the user input (syntax and constrains checking) before sending it to the backend

Besides the above middlewares, there are some other self-defined middlewares:
- Authentication: check if the user is logged and authenticate the user session by using the user information in the token generated by [JWT](https://www.npmjs.com/package/jsonwebtoken) 
- Error handling: handle the error and return the appropriate response

#### **Other tools**
- [nodemailer](https://www.npmjs.com/package/nodemailer): is used to send email to the user to inform user about the username and password of the account
- [argon2](https://www.npmjs.com/package/argon2): is used to hash and check the user password 
- [JWT](https://www.npmjs.com/package/jsonwebtoken): is used to generate and verify the token. The token is sent to the user when the user logs in. Each request from the user will be verified by this token.
- [generate-password](https://www.npmjs.com/package/generate-password): is used to generate a random password for the user when a new account is created.  

#### 4. Controller
In this layer, the core logic behind the application is handled. With the provided query functions from Database layer and preprocessed inputs from Middleware layer, a list of functions has been written, serving the purpose of sending the required information to the client and adding more features to the website.
The functions take a JSON file as an input and return the status as well as the query results in an array of JSONs:
##### Employee
- This function returns the information of all employees and their corresponding accounts in the company:
```
listAllUser({})
```
- This function returns the information of all employees and their corresponding accounts in a branch if the branchID is provided:
```
listAllUserInBranch({
    "bid": <int>
})
```
- This function returns the information of a single employee and his corresponding account if the employeeID is provided:
```
showOneUserInfo({
    "id": <int>
})
```
- This function inserts a new employee and his corresponding account into the database if the required information is provided. The new employeeID is returned for other uses:
```
postEmployee({
    "ename": <string>,
    "mail": <string>,
    "erole": <string>,
    "bid": <int>,
    "pass": <string>,
    "url": <string>,
})
```
- This function updates an employee with the information provided. An employeeID is required:
```
putEmployee({
    "eid": <int>,
    "url": <string>,
    "mail": <string>,
    "pass": <string>
})
```
- This function deletes an employee if the employeeID is provided:
```
deleteEmployee({
    "employeeID": <int>
})
```
##### Bill
- This function inserts a new invoice to the database if required information is provided:
```
postBill({
    "eid": <int>,
    "bid": <int>,
    "dmy": <Date>,
    "total": <int>,
    "drugList": [
        {
            "did": <int>,
            "qnt": <int>
        }
        ...
    ]
})
```
##### Branch
- This function return the information of a branch:
```
getBranch({
    "bid": <int>
})
```
- This function returns the information of all branches:
```
getBranch()
```
##### Manager
- This function returns the information of the manager of a branch:
```
getID({
    "bid": <int>
})
```
##### Revenue
- This function returns the revenue of a branch:
```
getRevenueBranch({
    "bid": <int>
})
```
- This function returns the revenue of the whole company:
```
getRevenueCompany({
    "bid": <int>
    "year": <int>
    "month": <int>
})
```
- This function returns the top selling drugs of a branch:
```
getDrugsaleBranch({
    "bid": <int>
    "start_date": <Date>
    "end_date": <Date>
    })
```
- This function returns the top selling drugs of the whole company:
```
getDrugSaleCompany({
    "start_date": <Date>
    "end_date": <Date>
    )}
```
#### 5. Database
This layer is the interface for connecting PostgreSQL server to the web application. At the beginning, the general schema for the database was created using SQL and then got populated using Python ([source code](https://colab.research.google.com/drive/1cT2eHIdTkIduY7dkuJ0DOp1r_jlfI_oh?usp=sharing)). The completed database is hosted on Digital Ocean for remote accessing, which is more convenient for testing.
Connecting PostgreSQL to the application is done by the module "[node-postgres](https://node-postgres.com)". In addition, for each relational table, basic CRUD functions as well as some complex queries, written in NodeJS, are provided to the Controller layer.

### Frontend
In this project HTML, CSS and pure JS were used for the frontend but not any other JS frameworks like React or Angular because most of the members in the frontend group didn't have any experience working in web development before so without a framework would be easier for everyone. So the task of each member in the group would be: 
- Manager page and Login page (Minh Duc)
- Employee page (Nang Tan)
- CEO page (Nguyen Khoa)

This application starts at the `login.html` page, then the user is prompted to enter the `username` and `password`, then he will send a request to the server at the `/login` endpoint. If the credentials is correct then the server will return back a response which looks similar to this
```js
{
    token:"AXsdfji_123kji.jkasjdfkj123",
    role: "ceo",
    username: "minhduc",
    id: 1,
}
```
Datas like `token` or `username` are stored in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), for further access between pages. Then based on the `role` property, the user will be redirec ted to the correct page. Then the user must append the `token` to his others requests headers in order to send to the server so that the server can know who is sending the request and validate it. Then based on the role of the employee, the user can send requests to several endpoints like `/drug` , `/branch`, `/employee` to get the required data


### Chat Feature
For the convenience of implementing this chat feature, Express is selected because it is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications. The advantages of using this framework can be listed below:
- Allowing developers to define routes of their application based on HTTP methods and URLs.
- Easy to connect with databases such as [MongoDB](https://www.mongodb.com/).
- Saving a lot of coding time. 

This project follows strictly the [Client-Server](https://en.wikipedia.org/wiki/Client%E2%80%93server_model) model which clients would send requests to a server and these requests will be executed by the server. In terms of communication between the server and clients, Socket.IO, a library that enables low-latency, bidirectional and event-based connection, is chosen because it is commonly used and easy to implement. 

The chat server will be hosted on Digital Ocean and its set-up is implemented as below: 
```js
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
```

The server is listening for a ‘connection’ event and will run the provided function anytime this happens.
```js 
io.on("connection", function(socket) {
 console.log(“socket connected”);
});
```

In the client side, a socket connection set-up is created:
```js
const socket = io();
```
Clients and server transmit and receive their messages or data through ```socket.emit("topic")``` and ```socket.on("topic")```, respectively. 

For private chat, this feature makes use of ```room```, an arbitrary channel that sockets can ```join()``` and ```leave()```. The information to a room is sent to only clients who have joined that room:
```js
io.to(roomid).emit('new-chat', result)
```

To store the messages of conversations, [MongoDB](https://account.mongodb.com/account/login?n=%2Fv2%2F629859fb7b4f265a38f0b9a3&nextHash=%23clusters%2Fdetail%2FCluster0), a remote database that provides a shared cluster to contain collections of data, has been used. This cluster creates a URI for users to access and store data to the collection that is constructed previously:
```js
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://minh:vcl123456@cluster0.x2dev.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
client.connect();
const database = client.db("myDB").collection("myCol")
```

About the on off status of the users, server gets a list of all users who are connecting to the server. Based on that list we can find out who is online and who is offline. When users connect to server, client will send a notification to server through ```socket.emit()``` to add user to the list.

When user clicks on chat, a ```token``` that is stored in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) is taken and used to authenticate to the server. After authenticating, the ```username``` and ```userid``` of user can be collected. With  ```userid```, all chat history in [MongoDB](https://www.mongodb.com/) is shown in private conversation. Moreover, messages are sorted in time order to find out latest chats and also put in a unique list which is used to create chat conversations between user and others users.

In the chat section, when a user sends a messaage to another one, the message is also included with the id of the sender and the receiver. Based on the id of the sender, it can be determined that the message is displayed to the right of the conversation if it is from current user or to the left if it is from other user.

### DevOps
Initially, `Gitlab` is utilized to build a CI/CD pipeline. However, after installing Gitlab runner for the project, there are some struggles relating `.gitlab-ci.yml` file because of our inexperience in DevOps. Fortunately, after spending time to research, [Buddy.works](https://app.buddy.works/), which is a fully-featured DevOps platform with no learning curve that packs everything users need from a CI/CD tool, is discovered. 

`Buddy.works`can hook up existing GitLab repos, and can be used as a [build server](https://buddy.works/docs/pipelines/builds-and-testing) and [deployment tool](https://buddy.works/docs/pipelines/deployments) without the need to move the source code. To figure out how `Buddy` is more beneficial than `Gitlab`, accessing the attached [Compare Buddy to Gitlab CI/CD](https://buddy.works/compare/gitlab-ci-alternative). In particularly, `Buddy` can solve the problem with `.gitlab-ci.yml` file that appeared at the beginning:  

#### ✅ Ease of use
Easy pipeline configuration in the most user-friendly UI/UX ever designed.
#### ✅ Works with our own stack
No problems with YAML file, just build, test and deploy the project with over 100 actions.
#### ✅ Full CI/CD package
From serverless deployment to Docker and Kubernetes, every modern tech and framework is supported.


**Three** CI/CD pipelines are performed with the help of `Buddy`:
- **Pipeline 1** (Test features): This is a **CI** pipeline that builds & tests automatically each feature submitted to the application except for branch `backend` & `main` by using regex `(^refs/heads/((?!(main|backend)$).)*$)` to edit trigger event. The pipeline is set up with two actions:
    ![](https://i.imgur.com/SjWm4LK.jpg)
        <p style="text-align: center;"> <i>Figure 6.1: Entity Relationship Diagram</i></p>    
    - *Prepare Environment*: done automatically by `Buddy`
    - *Execute npm test*: done by setting up 2 command lines: 
    ```bash   
        {
            #yarn install
            npm install
            npm test
        }
    ```

- **Pipeline 2** (BackendToProduction): This is the 2nd **CI** pipeline that is similar to the 1st one, but it tests automatically all changes submitted to branch `backend` before merged to branch `production` by running integration test. Similarly, two actions is set up: 

    ![](https://i.imgur.com/P3Sedva.jpg)
        <p style="text-align: center;"> <i>Figure 6.2: Entity Relationship Diagram</i></p>
    + *Prepare Environment*: done automatically by `Buddy`.
    + *Execute npm run test_integration*: done after setting up *server* and *database* as below, and finally send *http request* to the server to check the response is whether similar to our expected one or not.
        
        This is the code for setting up database `postgresql 12` to ensure the pipeline will work well on `Buddy`.
        
        ![](https://i.imgur.com/hhJHvoN.png) 
        
        Then the final commands is as below:
    ```bash
        {
            #set up database
            service postgresql start
            psql -a -f PE.sql 
            #set up server
            npm install
            #up integration test
            npm run test_integration
        }
    ```
    

    - For more details about `test_integration`, it automatically tests all the endpoints of cases based on all 3 routines CEO, Manager and Employee, so that by answering the questions of what each role will do in the system, the test for such a situation will be created. *For example*, the code below describes a case when the *CEO try to log in company website without password*:

    ``` mocha
        {
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
        }

- **Pipeline 3** (Deploy): This pipeline is not built on `Buddy` as it is more convenient to deploy by applying DigitalOcean.






## Result and discussion

### Lesson learned
During the process of building this project, we have made several mistakes and we would like to share a few thing here:
- When writing interface code for database, we should have **specified clearly each inputs** instead of wrapping them in an object and then extract them again in the interface code,which make it increasingly frustrating when we use the database code in our service as we often forget to insert the required key and value into the input object for the database code.
- The development process of our API backend server should be done independently, meaning that a person who is responsible for building an HTTP endpoint on the server should also be responsible for creating business code associated with that endpoint and writing unit tests and integration test associated with it.
- Building an integration test suite at the end of the project is **almost too late**. During the time where we had to deploy without integration test, before every push we have to send HTTP requests manually to our local server and check the response for error,which is prone to error caused by members skipping some execution path in their test routine, and by the time the integration test was introduced, a lot of bugs had already occured on deployment and  had been fixed.  An integration test should be made as soon as possible, ideally right before the whole functional code for one specific usecase is done.

- **Never attempt to make REST API documentation first**: in this project the documentation for API was created first supposedly to state a clear interface for both backend to implement and the frontend to call upon. However, things did not go as planned, since the frontend team constantly add new features and demand data that is not compatible with what the API documentation provide and the backend team have to create more endpoint on the API to satisfy them, making the api documentation obsolete. What should have been done is to 
    - design a UI prototype before everything else if the usecase diagram does not provide enough information.
    **OR**
    - Make the usecase diagram **specific enough so that the team cannot stray from the desired implementation**. For example: on employee creation usecase,"create employee account" was not specified clearly enough . Later on the frontend team make an interface to create employee with name and birthday and image, but the backend code requires name and email but no image. So we had to add image url in the database and remove the birthday in the frontend. All of this could have been avoided if we specified at the beginning what information of the employee the manager has to insert in the "create employee account" usecase.

### Result
Ultimately, we were able to deploy everything in our codebase on the cloud and the website is fully functional at https://tiemthuocgiadinh-login.netlify.app/. The app still lacks some utility features such as exporting revenue to PDF, viewing order history, etc. but those can be added in the near future.

### Conclusion
In conclusion, the project provided us with an excellent opportunity to practise our teamwork and coding skills. Moreover, our team has also gain knowledge on the process from when our first idea begins until a complete application is deployed to the web. During the process, some issues with the requirements arose; however, we managed to overcome those issues and fully developed the desired platform.

Finally, we would appreciate feedback in order to improve the performance and reliability of our application.