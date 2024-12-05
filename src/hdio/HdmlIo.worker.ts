/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { hashify } from "@hdml/hash";
import { parseHDML } from "@hdml/parser";
import { HDOM, Connection, Model, Frame } from "@hdml/types";

let host: string;
let tenant: string;
let token: string;
let hdom: HDOM;

let s: string;
let h: string;
const connections: Map<string, Connection> = new Map();
const models: Map<string, Model> = new Map();
const frames: Map<string, Frame> = new Map();
const names: Map<string, string> = new Map();

type HdmlMessage =
  | {
      type: "props";
      data: {
        host: string;
        tenant: string;
        token: string;
      };
    }
  | {
      type: "html";
      data: {
        html: string;
      };
    };

function sortFrames(frames: Frame[]): Frame[] {
  const map = new Map(
    frames.map((frame) => [`?hdml-frame=${frame.name}`, frame]),
  );
  const visited = new Set<string>();
  const sorted: Frame[] = [];

  const visit = (frame: Frame) => {
    if (visited.has(frame.name)) return;
    visited.add(frame.name);
    if (
      frame.source.indexOf("?hdml-frame") === 0 &&
      map.has(frame.source)
    ) {
      visit(map.get(frame.source)!);
    }
    sorted.push(frame);
  };

  frames.forEach((item) => visit(item));
  return sorted;
}

globalThis.self.onmessage = (message: MessageEvent) => {
  const msg = <HdmlMessage>message.data;
  if (msg.type) {
    switch (msg.type) {
      case "props":
        host = msg.data.host;
        tenant = msg.data.tenant;
        token = msg.data.token;
        console.log(host, tenant, token);
        break;
      case "html":
        connections.clear();
        models.clear();
        frames.clear();
        names.clear();
        hdom = parseHDML(msg.data.html);
        hdom.connections.forEach((c) => {
          connections.set(c.name, c);
        });
        hdom.models.forEach((m) => {
          h = hashify(JSON.stringify(m));
          s = `/${h}.html?hdml-model=${m.name}`;
          names.set(`?hdml-model=${m.name}`, s);
          models.set(s, m);
        });

        hdom.frames.forEach((f) => {
          if (f.source.indexOf("?hdml-model") === 0) {
            if (names.has(f.source)) {
              f.source = names.get(f.source)!;
              h = hashify(JSON.stringify(f));
              s = `/${h}.html?hdml-frame=${f.name}`;
              names.set(`?hdml-frame=${f.name}`, s);
              frames.set(s, f);
            }
          }
        });

        sortFrames(hdom.frames).forEach((f) => {
          if (f.source.indexOf("?hdml-frame") === 0) {
            if (names.has(f.source)) {
              f.source = names.get(f.source)!;
              h = hashify(JSON.stringify(f));
              s = `/${h}.html?hdml-frame=${f.name}`;
              names.set(`?hdml-frame=${f.name}`, s);
              frames.set(s, f);
            }
          }
        });

        hdom.frames.forEach((f) => {
          if (f.source.indexOf("/") === 0) {
            h = hashify(JSON.stringify(f));
            s = `/${h}.html?hdml-frame=${f.name}`;
            names.set(`?hdml-frame=${f.name}`, s);
            frames.set(s, f);
          }
        });

        console.log(msg.data.html);
        console.log(hdom);
        console.log(names);
        console.log(models);
        console.log(frames);
        break;
    }
  }
};

const _script = "_script";
export default _script;
