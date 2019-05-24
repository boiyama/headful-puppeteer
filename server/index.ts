import express from "express";
import next from "next";
import browseHandler from "./browseHandler";

const port = parseInt(process.env.PORT as string, 10) || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const createExpressApp = () =>
  express()
    .get("/api/browse", browseHandler)
    .get("*", (req, res) => handle(req, res))
    .listen(port, (err: Error) => (err ? console.error(err) : console.log(`> Ready on http://localhost:${port}`)));

app.prepare().then(createExpressApp);
