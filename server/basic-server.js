/* Import node's http module: */
const express = require("express");
const app = express();
var fs = require("fs");
const logger = require("./middleware/logger.js").logger;

const port = 3000;
const ip = "127.0.0.1";

// app.use(logger);

app.use(express.json());

app.get("/classes/messages", (req, res) => {
  fs.readFile("./server/storage.JSON", function(err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

app.post("/classes/messages", (req, res) => {
  req.body.objectId = Date.now();
  res.send(req.body);
  var newMsg = req.body;

  fs.readFile("./server/storage.JSON", function(err, data) {
    if (err) {
      throw err;
    }
    var storage = JSON.parse(data);
    storage.results.push(newMsg);

    fs.writeFile("./server/storage.JSON", JSON.stringify(storage), function(
      err,
      data
    ) {
      if (err) {
        throw err;
      }
    });
  });
});

app.use(express.static("/Users/admin/hrnyc23-chatterbox-server/client"));

app.listen(port, ip, () => {
  console.log("Listening on http://" + ip + ":" + port);
});
