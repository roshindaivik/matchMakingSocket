const serverConfig = require("./server");

const server = serverConfig.createServer();

server.listen(5000, () => {
  console.log("server started port");
});
