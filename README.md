# ServerStudy
The 12 applications are all independent to each other.


## 1. BBS: A simple bulletin board with react and express.

Log data is stored using NeDB. NeDB is a file-based simple database that stores data in JSON format as a NoSQL DB.

React clients usually operate by communicating with web servers. However, React does not provide an Asynchronous JavaScript XML (Ajax) communication function. Therefore, a separate library such as jQuery is used. However, since jQuery is a too much library with DOM manipulation functions, this example code uses a Superagent module that only provides communication functions with web servers.

The web pack used here is a module that combines resource files such as JavaScript or CSS into one or converts files created by special techniques such as JSX. Using a web pack automatically solves the JavaScript module dependence relationship, making it very convenient. Web packs offer a variety of plug-ins, which use Babel plug-ins to convert up-to-date JavaScripts to run on older browsers.

Run command.

$ npm install
$ npm run build    // Convert /src/index.js to /public/bundle.js using webpack module
$ npm bbs-server.js
![bbs](https://user-images.githubusercontent.com/47931506/147632765-880d4ad2-9a38-4e3a-8644-c6994e55b76e.png)


## 2. chat: A simple real-time chat web app with Socket.IO.

When the client requests data from the server with the HTTP code, the server may respond to it. However, in order to transfer data from the server to the client without the client's requests, you need to use a websocket. Web sockets are technologies for two-way communication between servers and clients.

HTTP communication uses a URI schema called "http://xxx" and encrypted "https://xxx", while the websocket uses a schema called "ws://xxx" and encrypted "wss://xxx". This example uses a module called Socket.IO that makes web sockets convenient to use.

Run commands
$ npm install
$ npm run build      // convert /src/index.js to /public/bundle.js with webpack module!
$ npm chat-server.js

![chat](https://user-images.githubusercontent.com/47931506/147633163-be487e17-b913-4282-af2f-d265e33c0944.png)


## 3. express_test: simple express tutorial

Express is a framework dedicated to developing web applications that is most commonly used by Node.js users.

run codes (node must be installed). $npm install or $node statc.js or $node dice-q.js or $node post-test.js or $node post-upload.js

$ When I run node static.js,
If you put /foo.html in the address window and /bar/index.html, you can see that all pages in the /html directory can be answered using express.static. If you don't put anything in, index.html is answered by default.

post-test.js screen shot
![post-test js_screenshot](https://user-images.githubusercontent.com/47931506/147633370-072cc685-e2b5-464c-a180-86ab4b4d414d.png)

post-upload.js screen shot
![post-upload js_screenshot](https://user-images.githubusercontent.com/47931506/147633379-65ed6dde-e54e-4e3c-a911-2327a58a5247.png)

post-static.js screen shot
![static js_screenshot](https://user-images.githubusercontent.com/47931506/147633388-40c26fda-41e1-416d-856e-4bc9a07f5f0f.png)


## 4. gif-chat: Real-time chatting web app

Web socket is a technology for real-time bidirectional data transmission with a newly added specification to HTML5, and unlike HTTP, it uses a protocol called WS.

Before the websocket came out, real-time data transfer was implemented using HTTP technology. One of them is a technology called Polling, which was a simple way for the client to periodically send requests to the server to check for new updates, and the server to respond to new content if there is anything new.

However, if you use a web socket, it remains connected after the web socket is initially connected, so if there is anything to update, the server can inform the client immediately.

Usually, a socket.IO module in which the websocket is wrapped is used. In Socket.IO, namespaces such as /room, /chat are assigned to transfer data only between the same namespaces.

There is a room as a more detailed concept than a name space. Using a room, data can only be exchanged between sockets in the same room even in the same namespace.

Run commands
$ npm install
$ node app.js

![roomlist](https://user-images.githubusercontent.com/47931506/147633726-429b7f27-d0fe-4ebe-9d82-e54007cc1381.png)
![chat (1)](https://user-images.githubusercontent.com/47931506/147633730-82809c69-1bc4-4938-94c7-e0902c3c1c55.png)


## 5. http-module-server: Many servers using http module

Run command. (Go into each directory first!)
$ node "Server code name".js

1. /plainSerer
The server receives a request from the client and responds. Therefore, when a request is received from a client, an event listener must be registered in advance to perform what action to perform.

When sending a request to the server, the content of the request is represented through the address. If the address is /index.html, it means to send index.html of the server. But you don't have to always ask for html. A file such as css, js, or image may be requested, or a specific operation may be requested.

2. /restSerer
Here comes REST! Since the content of the request is represented through the address, it is good for the server to use an easy-to-understand address.

REST: It refers to a method of defining resources and addressing resources on a REpresentational State Transfer server. It's a kind of promise. The address consists of nouns. It may be assumed that a resource related to user information is requested if it is /user, and a resource related to a post if it is /post.

REST uses HTTP request methods in addition to addresses. (For example, the bulletin board server)

- GET: When you bring the contents of the post,
- POST: When you register a new post,
- PUT: When replacing the whole text with new content,
- PATCH: When you modify a part of the text,
- DELETE: When you delete the post,
For example, if a request is sent to the /user address by the GET method, a server responses with user infomation. If a request is sent to the /user address by the POST method, it can be seen that it is a request to register a new user.

3. /cookie
From the server's point of view, how can it know whose request the client sends? Can I know the IP address or browser information? No! This is because multiple computers have a common IP address, or one computer can be used by multiple people.

You have to log in. In order to implement login, you need to know about cookies and sessions.

To remember who you are using the Internet, the server sends cookies together when responding to a request. Cookies are simple pairs of 'key-values' such as name=samuel. When cookies come from the server, the web browser stores them and sends them the next time you request them. The server reads these cookies to determine who the user is.

Cookies are sent in the header of the request. Therefore, cookies are exposed to all network information tabs that appear when the F12 key is pressed. -> There is a risk of personal information leakage!

A 'session' comes out to solve this problem. (check out cookie/session.js) Session is a variable, which stores user information in this variable and communicates with the client with the session ID. In this example, sessions were made into variables and stored in server code, but sessions are usually placed in databases such as Redis and Memcached.

4. /planeSer/server1-3.js and /planeSer/server1-4.js
The https module adds SSL encryption to the web server. It encrypts data that comes and goes when making a GET or POST request, making it impossible to verify the content even if someone intercepts the request in the middle.

5. /cluster
When there is a server with eight cores, the node usually utilizes only one core. However, with the cluster module, one node process can be run in one core. However, in this case, there is a disadvantage of not being able to share memory. Here, clustering is implemented as a cluster module, but in practice, clusters are used as modules such as pm2.

## 6. learn-express: a simple web serer with express

Express is a module that grants additional functions to the request and response object of the http module. Almost all Node.js servers are made of express modules.

Middleware is the core of express. Middleware is called middleware because it is located in the middle of a request and response. Middleware manipulates requests and responses to add functions or filter out bad requests. Middleware is a function with req, res, and next as parameters and is mounted as app.use, app.get, app.post, etc. If you want the middleware to run only on the request of a particular address, you just need to put the address as the first argument.

nodemon module: automatically restarts the server whenever the server code is modified.

Run commands
$ npm install
$ node app.js

## 7. learn-mongoose: Simple mongoDB based board
MongoDB is a representative of the NoSQL database. MongoDB uses JavaScript grammar, therefore, all you need to know is JavaScript if you use Node.js and MongoDB.

Mongoose: It is a module that wraps MongoDB easily like sequelize of MySQL.

The part where you install MongoDB and set up the environment $ Mongo
$ use admin
$ db.create ({user: 'root', pwd: 'rntmfoq', rolls: ['root']}) $ vi/usr/local/etc/monod.conf should be added below. (Based on MacBook) "Security: authorization: enabled"

Run command
$ npm install $ node app.js
![mongoose](https://user-images.githubusercontent.com/47931506/147636013-117571ee-e878-4600-b485-4edba844dcd0.png)


## 8. node-auction: Auction web app
Online auctions must end at the same time for everyone. However, since the client's time is different, it is unreliable, so the server has to send server time. To this end, the Servercent event is used.

WebSocket is used to bid for an auction.

First, you need to install MySQL. And enter MySQL config information in /config/config.json.

Run commands
$ npm i
$ npm sequelize init
$ node app.js

![list](https://user-images.githubusercontent.com/47931506/147636188-db10b172-22fa-4b05-a816-dd50bf99c33e.png)
![auction](https://user-images.githubusercontent.com/47931506/147636214-4cbdee0f-caf1-4fed-bbac-fb7ca8dd8cb9.png)
![boughtList](https://user-images.githubusercontent.com/47931506/147636221-9d48285b-ce25-4384-b6ca-7a48074cbb53.png)


## 9. nodebird: SNS
A simple SNS service with Kakao API sign in, simple sign in, posting, searching hash tag, following function. Used Node.js, MySQL(with sequalize), express, passport, sequalize.

/models: MySQL codes /routes: express.Router codes /view: html codes with nunjucks /passport: sign in implementation with passport module

Run commands
$ npm install
$ npm run build:parser // Convert /src/index.js to /public/bundle.js with webpack module
$ npm start
<img width="939" alt="login" src="https://user-images.githubusercontent.com/47931506/147636344-cf1e1e09-8134-494e-920c-911519f323b4.png">
<img width="939" alt="timeline" src="https://user-images.githubusercontent.com/47931506/147636347-7499a0ce-a385-4d47-8283-24cc0fe954f0.png">


## 10. router_test: Simple React Router tutorial

React routers are used to create applications with multiple pages.

Execution code.
$ npm install
$ npm start

![ScreenShot](https://user-images.githubusercontent.com/47931506/147636512-8754de62-5a9f-410c-b8ab-75d2657cd117.png)


## 11. sns: Very Simple SNS
Implementation of a user authentication mechanism, timeline function, adding friends, and outputting friends' timeline.

Execution command.
$ npm install
$ npm run build      // convert /src/index.js to /public/bundle.js with webpack module!
$ npm start

<img width="986" alt="login (1)" src="https://user-images.githubusercontent.com/47931506/147636648-0cb9de08-dc61-4998-8150-33b46804fbed.png">
<img width="987" alt="timeline (1)" src="https://user-images.githubusercontent.com/47931506/147636649-8ed06fa6-548c-4dbb-acb4-cca7c3b42625.png">
<img width="986" alt="add_friends" src="https://user-images.githubusercontent.com/47931506/147636655-dc1083de-9ea2-4286-8ec6-d711a27e699a.png">


## 12. wiki: Very Simple WIKI
The client is implemented with react, and the server is implemented with express. The client and the server perform asynchronous communication (Ajax) through the API as needed.

The wiki client made of react has an output page and an editing page, and changes the page using a react router. The wiki server stores wiki text data in the NeDB and provides functions of referring, adding, and modifying data through the API.

Execution command.
$ npm install
$ npm run build      // convert /src/index.js to /public/bundle.js with webpack module!
$ npm start

