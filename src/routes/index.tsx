import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import type { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";

// import {
//   PerspectiveViewerConfig,
// } from "@finos/perspective-viewer";

export default component$(() => {
  const viewerRef = useSignal<HTMLPerspectiveViewerElement>();

  // useOnWindow(
  //   "load",
  //   $(async () => {
  //     if (isBrowser) {
  //       const initPerspective = async () => {
  //         await import("@finos/perspective-viewer");
  //         await import("@finos/perspective-viewer-datagrid");
  //         await import("@finos/perspective-viewer-d3fc");
  //         const perspective = await import("@finos/perspective");

  //         const worker = await perspective.default.worker();

  //         const config /*: PerspectiveViewerConfig */ = {
  //           group_by: ["State"],
  //         };

  //         const getTable = async (): Promise<perspective.Table> => {
  //           const req = fetch("./superstore.lz4.arrow");
  //           const resp = await req;
  //           const buffer = await resp.arrayBuffer();
  //           return await worker.table(buffer);
  //         };

  //         const table = await getTable();
  //         if (viewerRef.value) {
  //           viewerRef.value.load(Promise.resolve(table));
  //           viewerRef.value.restore(config);
  //         }
  //       };
  //       initPerspective().catch((error) => {
  //         console.error("Error initializing Perspective:", error);
  //       });
  //     }
  //   })
  // );

  // We'll dynamically import perspective modules during onMount$ to ensure they only run on the client.
  // We'll also define a placeholder data set for demonstration.

  return (
    <>
      <h1>Hi 👋</h1>
      <perspective-viewer
        id="my_viewer"
        style={{ width: "100%", height: "100%" }}
        theme="Pro Dark"
        ref={viewerRef}
      ></perspective-viewer>
    </>
  );
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
    {
      rel: "stylesheet",
      href: "https://unpkg.com/@finos/perspective-viewer/dist/css/themes.css",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/@finos/perspective-viewer@3.2.0/dist/css/pro.css",
    },
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
    {
      script: `
            import perspective from "/node_modules/@finos/perspective/dist/cdn/perspective.js";
            const WORKER = await perspective.worker();
            async function on_load() {
                var el = document.getElementsByTagName("perspective-viewer")[0];
                const plugin = await el.getPlugin("Heatmap");
                plugin.render_warning = false;
                const table = WORKER.table(this.response);
                await el.load(table);
                await el.toggleConfig();
                window.__TEST_PERSPECTIVE_READY__ = true;
            }

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/superstore.lz4.arrow", true);
            xhr.responseType = "arraybuffer";
            xhr.onload = on_load.bind(xhr);
            xhr.send(null);    
            `,
      props: {
        async: true,
        defer: true,
        type: "module",
      },
    },
    {
      props: {
        async: true,
        defer: true,
        type: "module",
        src: "https://unpkg.com/@finos/perspective-viewer/dist/cdn/perspective-viewer.js",
      },
    },
    {
      props: {
        async: true,
        defer: true,
        type: "module",
        src: "https://unpkg.com/@finos/perspective-viewer-datagrid/dist/cdn/perspective-viewer-datagrid.js",
      },
    },
    {
      props: {
        async: true,
        defer: true,
        type: "module",
        src: "https://unpkg.com/@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js",
      },
    },
  ],
};
