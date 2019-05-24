import React, { useState, useEffect } from "react";
import axios from "axios";

type ReactFC<P> = React.FC<P> & { getInitialProps?: (context: { req: { query: { url: string } } }) => Promise<P> };

interface Props {
  initialUrl: string;
}

type Url = string | undefined;

type Position = {
  x: number;
  y: number;
} | null;

const homeUrl =
  process.env.NODE_ENV === "production" ? "https://boiyaa-headful-puppeteer.appspot.com/" : "http://localhost:8080/";

const Index: ReactFC<Props> = ({ initialUrl }) => {
  const [mouseOffset, setMouseOffset] = useState<Position>(null);
  const [inputValue, setInputValue] = useState<Url>(
    initialUrl ? initialUrl : "https://developers.google.com/web/tools/puppeteer/"
  );
  const [query, setQuery] = useState<{
    url: Url;
    position: Position;
  }>({ url: inputValue, position: mouseOffset });
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!query.url) {
      return;
    }

    // (2) 入力されたURL、画面サイズを渡す
    // (8) 現在のURL、画面サイズ、クリックした座標を渡す
    const url = query.url;

    const browserWindow = document.getElementById("window");
    const width = browserWindow ? browserWindow.clientWidth.toString() : "";
    const height = browserWindow ? browserWindow.clientHeight.toString() : "";

    const params = query.position
      ? new URLSearchParams({
          url,
          width,
          height,
          "position[x]": query.position.x.toString(),
          "position[y]": query.position.y.toString()
        })
      : new URLSearchParams({ url: query.url, width, height });

    const browser = `/api/browse?${params.toString()}`;

    axios.get(browser).then(response => {
      // (6) (12) ウィンドウにスナップショットを表示
      setImgSrc(response.data.screenshot);
      setInputValue(response.data.url);

      history.pushState(null, "", `?url=${encodeURIComponent(url)}`);
    });
  }, [query]);

  return (
    <>
      <section>
        <h1>Headful Puppeteer</h1>

        <div id="container">
          <div id="address-bar">
            <button
              onClick={() => {
                setQuery({ url: homeUrl, position: null });
              }}
            >
              🏠
            </button>
            {/* (1) アドレスバーにURLを入力 */}
            <input
              type="text"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              onKeyDown={event => (event.keyCode === 13 ? setQuery({ url: inputValue, position: null }) : null)}
            />
          </div>

          {/* (7) スナップショット上のリンクをクリック */}
          <div
            id="window"
            onMouseMove={event => setMouseOffset({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })}
            onClick={() => setQuery({ url: inputValue, position: mouseOffset })}
          >
            {imgSrc ? <img src={`data:image/png;base64,${imgSrc}`} /> : ""}
          </div>
        </div>
      </section>
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
        }

        body {
          margin: 0;
          background-image: radial-gradient(red, yellow, green);
        }
      `}</style>
      <style jsx>{`
        section {
          height: 100%;
          box-sizing: border-box;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        h1 {
          margin: 0 0 20px 0;
          line-height: 1;
          color: #fff;
        }

        #container {
          height: 100%;
          background-color: #fff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        #address-bar {
          display: flex;
          border-bottom: 1px solid #ccc;
        }

        #window {
          flex: 1;
        }

        button {
          border: none;
          padding: 1em;
          border-right: 1px solid #ccc;
        }
        button:hover {
          background-color: #dff;
          cursor: pointer;
        }

        input {
          border: none;
          width: 100%;
          padding: 1em;
        }
      `}</style>
    </>
  );
};

Index.getInitialProps = async (context: { req: { query: { url: string } } }) => ({ initialUrl: context.req.query.url });

export default Index;
