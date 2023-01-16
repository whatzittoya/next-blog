const express = require("express");
const payload = require("payload");
const next = require("next");
const app = express();
payload.init({
  secret: "SECRET_KEY",
  mongoURL:
    "mongodb+srv://whosendall:123Comment.@cluster0.hs0jlne.mongodb.net/?retryWrites=true&w=majority",
  express: app,
});
const dev = true;
const nextApp = next({ dev });

const nextHandler = nextApp.getRequestHandler();

app.get("*", (req, res) => nextHandler(req, res));

nextApp.prepare().then(() => {
  console.log("NextJS started");

  app.listen(3000, async () => {
    console.log(`Server listening on $3000}...`);
  });
});
