// import type * as Perspective from "./perspective-connector/perspective/perspective";
// import { type Table } from "./perspective-connector/perspective/perspective";
// import { type HTMLPerspectiveViewerElement } from "./perspective-connector/perspective-viewer/perspective-viewer";

import type { DocumentHead } from "@builder.io/qwik-city";
import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  createElement,
  useOnWindow,
  useSignal,
} from "@builder.io/qwik";
import "./index.css";

type Table = {};

export default component$(() => {
  // const viewer = useRef<HTMLPerspectiveViewerElement>(null); // Importing Types Break Production build
  const viewer =
    useSignal<NoSerialize<{ restore: (_: any) => {}; load: (_: any) => {} }>>();

  useOnWindow(
    "load",
    $(() => {
      (async () => {
        const perspective = await import(
          "../tools/perspective-connector/perspective/perspective"
        );
        await import(
          "../tools/perspective-connector/perspective-viewer/perspective-viewer"
        );
        await import("@finos/perspective-viewer-datagrid");
        await import("@finos/perspective-viewer-d3fc");

        const worker = perspective.default.worker();

        const getTable = async (): Promise<Table> => {
          const req = fetch("./superstore.lz4.arrow");
          const resp = await req;
          const buffer = await resp.arrayBuffer();
          return (await worker).table(buffer as any);
        };

        const config = {
          group_by: ["State"],
        };

        getTable().then((table) => {
          if (viewer.value) {
            viewer.value.load(Promise.resolve(table));
            viewer.value.restore(config);
          }
        });
      })();
    })
  );

  return createElement("perspective-viewer", { ref: viewer });
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
  links: [
    // {
    //   rel: "stylesheet",
    //   href: "https://unpkg.com/@finos/perspective-viewer/dist/css/themes.css",
    // },
    // {
    //   rel: "stylesheet",
    //   href: "https://unpkg.com/@finos/perspective-viewer@3.2.0/dist/css/pro.css",
    // },
  ],
  scripts: [
    // {
    //   script: `
    //   document.addEventListener('DOMContentLoaded', async () => {
    //   // Sample data
    //   const data = [
    //     { category: 'A', value: 10, time: new Date('2023-01-01') },
    //     { category: 'B', value: 20, time: new Date('2023-01-02') },
    //     { category: 'A', value: 15, time: new Date('2023-01-03') },
    //     { category: 'C', value: 40, time: new Date('2023-01-04') }
    //   ];
    //   // The perspective global is available via the CDN script
    //   const worker = window.perspective.worker();
    //   const table = worker.table(data);
    //   const viewer = document.getElementById('my_viewer');
    //   // Wait for custom elements to be defined (ensures <perspective-viewer> is ready)
    //   await customElements.whenDefined('perspective-viewer');
    //   // Load the data table into the viewer
    //   await viewer.load(table);
    //   // Configure the viewer’s view type and pivots
    //   viewer.setAttribute('view', 'y_line');
    //   viewer.setAttribute('column-pivots', '["category"]');
    //   viewer.setAttribute('row-pivots', '["time"]');
    //   viewer.setAttribute('columns', '["value"]');
    //   viewer.setAttribute('aggregates', '{"value":"avg"}');
    //   // The viewer should now display a line chart with the given configuration.
    // });
    //   `,
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //   },
    // },
    // {
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //     src: "https://unpkg.com/@finos/perspective/dist/cdn/perspective.js",
    //   },
    // },
    // {
    //   script: `
    //         import perspective from "/node_modules/@finos/perspective/dist/cdn/perspective.js";
    //         const WORKER = await perspective.worker();
    //         async function on_load() {
    //             var el = document.getElementsByTagName("perspective-viewer")[0];
    //             const plugin = await el.getPlugin("Heatmap");
    //             plugin.render_warning = false;
    //             const table = WORKER.table(this.response);
    //             await el.load(table);
    //             await el.toggleConfig();
    //             window.__TEST_PERSPECTIVE_READY__ = true;
    //         }
    //         var xhr = new XMLHttpRequest();
    //         xhr.open("GET", "/superstore.lz4.arrow", true);
    //         xhr.responseType = "arraybuffer";
    //         xhr.onload = on_load.bind(xhr);
    //         xhr.send(null);
    //         `,
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //   },
    // },
    // {
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //     src: "https://unpkg.com/@finos/perspective-viewer/dist/cdn/perspective-viewer.js",
    //   },
    // },
    // {
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //     src: "https://unpkg.com/@finos/perspective-viewer-datagrid/dist/cdn/perspective-viewer-datagrid.js",
    //   },
    // },
    // {
    //   props: {
    //     async: true,
    //     defer: true,
    //     type: "module",
    //     src: "https://unpkg.com/@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js",
    //   },
    // },
  ],
};
