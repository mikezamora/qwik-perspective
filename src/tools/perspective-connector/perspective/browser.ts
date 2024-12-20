// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ ██████ ██████ ██████       █      █      █      █      █ █▄  ▀███ █       ┃
// ┃ ▄▄▄▄▄█ █▄▄▄▄▄ ▄▄▄▄▄█  ▀▀▀▀▀█▀▀▀▀▀ █ ▀▀▀▀▀█ ████████▌▐███ ███▄  ▀█ █ ▀▀▀▀▀ ┃
// ┃ █▀▀▀▀▀ █▀▀▀▀▀ █▀██▀▀ ▄▄▄▄▄ █ ▄▄▄▄▄█ ▄▄▄▄▄█ ████████▌▐███ █████▄   █ ▄▄▄▄▄ ┃
// ┃ █      ██████ █  ▀█▄       █ ██████      █      ███▌▐███ ███████▄ █       ┃
// ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
// ┃ Copyright (c) 2017, the Perspective Authors.                              ┃
// ┃ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ ┃
// ┃ This file is part of the Perspective library, distributed under the terms ┃
// ┃ of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import perspective_wasm from "@finos/perspective/dist/pkg/web/perspective-server.wasm?url";

import perspective_wasm_worker from "./perspective-server.worker.ts?worker";

import type * as psp from "@finos/perspective/dist/pkg/perspective-js.d.ts";

function invert_promise<T>(): [(t: T) => void, Promise<T>] {
  let sender;
  const receiver: Promise<T> = new Promise((x) => {
    sender = x;
  });

  return [sender as unknown as (t: T) => void, receiver];
}

async function _init(ws: Worker, wasm: ArrayBuffer) {
  const [sender, receiver] = invert_promise();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ws.addEventListener("message", function listener(_resp) {
    ws.removeEventListener("message", listener);
    sender(null);
  });

  ws.postMessage({ cmd: "init", args: [wasm] }, { transfer: [wasm] });
  await receiver;
}

/**
 * Create a new client connected exclusively to a new Web Worker instance of
 * the Perspective engine.
 * @param module
 * @returns
 */
export async function worker(module: Promise<typeof psp>) {
  const [wasm, webworker]: [ArrayBuffer, Worker] = await Promise.all([
    fetch(perspective_wasm).then((x: any) => {
      if (x instanceof Response) {
        return x.arrayBuffer();
      } else {
        return x.slice(0);
      }
    }),

    new perspective_wasm_worker(),
  ]);

  const { Client } = await module;
  const client = new Client(
    (proto: Uint8Array) => {
      const f = proto.slice().buffer;
      webworker.postMessage(f, { transfer: [f] });
    },
    () => {
      console.debug("Closing WebWorker");
      webworker.terminate();
    },
  );

  await _init(webworker, wasm);
  webworker.addEventListener("message", (json: MessageEvent<Uint8Array>) => {
    client.handle_response(json.data);
  });

  await client.init();
  return client;
}

/**
 * Create a new client connected via WebSocket to a server implemnting the
 * Perspective Protocol.
 * @param module
 * @param url
 * @returns
 */
export async function websocket(
  module: Promise<typeof psp>,
  url: string | URL,
) {
  const ws = new WebSocket(url);
  const [sender, receiver] = invert_promise();
  ws.onopen = sender;
  ws.binaryType = "arraybuffer";
  await receiver;
  const { Client } = await module;
  const client = new Client(
    (proto: Uint8Array) => {
      const buffer = proto.slice().buffer;
      ws.send(buffer);
    },
    () => {
      console.debug("Closing WebSocket");
      ws.close();
    },
  );

  ws.onmessage = (msg) => {
    client.handle_response(msg.data);
  };

  await client.init();
  return client;
}

export default { websocket, worker };
