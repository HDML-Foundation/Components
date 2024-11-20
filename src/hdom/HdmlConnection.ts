/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDML_TAG_NAMES, CONN_ATTRS_LIST } from "@hdml/types";
import { customElement, property } from "lit/decorators.js";
import { HdomElement } from "./HdomElement";

/**
 * The `HdmlConnection` component represents a connection to a
 * database. It is used to define the connection details for various
 * database types.
 *
 * The `hdml-connection` tag allows you to specify the `name` and
 * `type` attributes to identify and categorize your database
 * connections. Choose the appropriate type based on the database
 * system you are connecting to.
 *
 * @tagname hdml-connection
 *
 * @event {CustomEvent} - Triggers an `hdom-changed`
 * event on the `document` element when it is connected to or
 * disconnected from the `document`, or when any of the described
 * attributes change.
 *
 * @attribute {string} name - The name of the connection.
 *
 * @attribute {string} type - The type of the database. Available
 * types are:
 * - `postgresql`
 * - `mysql`
 * - `mssql`
 * - `mariadb`
 * - `oracle`
 * - `clickhouse`
 * - `druid`
 * - `ignite`
 * - `redshift`
 * - `bigquery`
 * - `googlesheets`
 * - `elasticsearch`
 * - `mongodb`
 */
@customElement(HDML_TAG_NAMES.CONNECTION)
export class HdmlConnection extends HdomElement {
  /**
   * @internal
   */
  @property({ type: String })
  [CONN_ATTRS_LIST.NAME]: string = "CONNECTION_NAME";

  /**
   * @internal
   */
  @property({ type: String })
  [CONN_ATTRS_LIST.TYPE]: string = "CONNECTION_TYPE";
}
