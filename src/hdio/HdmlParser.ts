/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { hashify } from "@hdml/hash";
import { parseHDML } from "@hdml/parser";
import { Connection, Model, Frame } from "@hdml/types";

export class HdmlParser {
  public connections: Map<string, Connection> = new Map();
  public models: Map<string, Model> = new Map();
  public frames: Map<string, Frame> = new Map();
  public names: Map<string, string> = new Map();

  #sortFrames(frames: Frame[]): Frame[] {
    const sorted: Frame[] = [];
    const map = new Map(
      frames.map((frame) => [`?hdml-frame=${frame.name}`, frame]),
    );
    const visited = new Set<string>();
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

  public parse(html: string): void {
    let s: string;
    let h: string;

    this.connections.clear();
    this.models.clear();
    this.frames.clear();
    this.names.clear();

    const hdom = parseHDML(html);
    hdom.connections.forEach((c) => {
      this.connections.set(c.name, c);
    });
    hdom.models.forEach((m) => {
      h = hashify(JSON.stringify(m));
      s = `/${h}.html?hdml-model=${m.name}`;
      this.names.set(`?hdml-model=${m.name}`, s);
      this.models.set(s, m);
    });

    hdom.frames.forEach((f) => {
      if (f.source.indexOf("?hdml-model") === 0) {
        if (this.names.has(f.source)) {
          f.source = this.names.get(f.source)!;
          h = hashify(JSON.stringify(f));
          s = `/${h}.html?hdml-frame=${f.name}`;
          this.names.set(`?hdml-frame=${f.name}`, s);
          this.frames.set(s, f);
        }
      }
    });

    this.#sortFrames(hdom.frames).forEach((f) => {
      if (f.source.indexOf("?hdml-frame") === 0) {
        if (this.names.has(f.source)) {
          f.source = this.names.get(f.source)!;
          h = hashify(JSON.stringify(f));
          s = `/${h}.html?hdml-frame=${f.name}`;
          this.names.set(`?hdml-frame=${f.name}`, s);
          this.frames.set(s, f);
        }
      }
    });

    hdom.frames.forEach((f) => {
      if (f.source.indexOf("/") === 0) {
        h = hashify(JSON.stringify(f));
        s = `/${h}.html?hdml-frame=${f.name}`;
        this.names.set(`?hdml-frame=${f.name}`, s);
        this.frames.set(s, f);
      }
    });
  }
}
