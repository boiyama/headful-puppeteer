import { Request, Response } from "express";
import puppeteer from "puppeteer";

const dev = process.env.NODE_ENV !== "production";

export default async (req: Request, res: Response) => {
  console.log(req.query);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: parseInt(req.query.width, 10), height: parseInt(req.query.height, 10) });

  // (3) Puppeteerでアクセス
  await page.goto(req.query.url, { waitUntil: dev ? "networkidle2" : "networkidle0" });

  if (req.query.hasOwnProperty("position")) {
    // (9) Puppeteerでアクセスし、指定座標でマウスクリックし、画面遷移する
    await Promise.all([
      page.mouse.click(parseInt(req.query.position.x, 10), parseInt(req.query.position.y, 10)),
      page.waitForNavigation({ waitUntil: dev ? "networkidle2" : "networkidle0" })
    ]);
  }

  // (4) (10) スナップショット取得
  const screenshot = await page.screenshot({ encoding: "base64" });
  const url = page.url();

  await browser.close();

  // (5) (11) スナップショットとURL状態を返す
  res.json({ screenshot, url });
};
