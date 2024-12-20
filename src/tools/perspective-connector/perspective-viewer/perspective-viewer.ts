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

/**
 * Module for the `<perspective-viewer>` custom element.  This module has no
 * (real) exports, but importing it has a side effect: the
 * `PerspectiveViewerElement`class is registered as a custom element, after
 * which it can be used as a standard DOM element.
 *
 * Though `<perspective-viewer>` is written mostly in Rust, the nature
 * of WebAssembly's compilation makes it a dynamic module;  in order to
 * guarantee that the Custom Elements extension methods are registered
 * synchronously with this package's import, we need perform said registration
 * within this wrapper module.  As a result, the API methods of the Custom
 * Elements are all `async` (as they must await the wasm module instance).
 *
 * The documentation in this module defines the instance structure of a
 * `<perspective-viewer>` DOM object instantiated typically, through HTML or any
 * relevent DOM method e.g. `document.createElement("perspective-viewer")` or
 * `document.getElementsByTagName("perspective-viewer")`.
 *
 * @module perspective-viewer
 */

export type { IPerspectiveViewerPlugin } from "@finos/perspective-viewer/src/ts/plugin.ts";
export { HTMLPerspectiveViewerPluginElement } from "@finos/perspective-viewer/src/ts/plugin.ts";
import type {
  ExportDropDownMenuElement,
  CopyDropDownMenuElement,
} from "@finos/perspective-viewer/dist/pkg/perspective-viewer.d.ts";

export interface HTMLPerspectiveViewerExportMenu
  extends HTMLElement,
    ExportDropDownMenuElement {}

export interface HTMLPerspectiveViewerCopyMenu
  extends HTMLElement,
    CopyDropDownMenuElement {}

export * from "@finos/perspective-viewer/src/ts/extensions.ts";
export type * from "@finos/perspective-viewer/dist/esm/ts-rs/ViewerConfigUpdate.d.ts";
export type * from "@finos/perspective-viewer/dist/esm/ts-rs/ColumnConfigValues.d.ts";
export type * from "@finos/perspective-viewer/dist/esm/ts-rs/Filter.d.ts";
export type * from "@finos/perspective-viewer/dist/esm/ts-rs/FilterTerm.d.ts";
export type * from "@finos/perspective-viewer/dist/esm/ts-rs/FilterReducer.d.ts";
// export type * from "./ts-rs/Vi"

import "./bootstrap";