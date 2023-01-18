const { HOST, PORT, app } = require("./server");

app.listen(PORT, HOST, () => {
  console.log("Server started");
});
