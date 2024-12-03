/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import _script from "./HdmlWorker.worker";

/**
 * The `hdml-io` component.
 *
 * @tagname hdml-io
 *
 * @attribute {string} host
 * @attribute {string} tenant
 * @attribute {string} token
 */
@customElement("hdml-io")
export class HdmlIo extends LitElement {
  /**
   * @internal
   */
  @property({ type: String })
  host: null | string = null;

  /**
   * @internal
   */
  @property({ type: String })
  tenant: null | string = null;

  /**
   * @internal
   */
  @property({ type: String })
  token: null | string = null;

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();

    let messagable: Window | Worker;
    if (_script === "_script") {
      messagable = globalThis.self;
    } else {
      const blob = new Blob([_script], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      messagable = new Worker(url);
      URL.revokeObjectURL(url);
    }
    messagable.postMessage("test message");
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    // logic here
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    // logic here
    super.disconnectedCallback();
  }

  /**
   * @internal
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}
