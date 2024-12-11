import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { isBrowser } from "@builder.io/qwik/build";

import type * as perspective from "@finos/perspective";
import type { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";

// import {
//   PerspectiveViewerConfig,
// } from "@finos/perspective-viewer";

export default component$(() => {
  const viewerRef = useSignal<HTMLPerspectiveViewerElement>();

  useOnWindow(
    "load",
    $(async () => {
      if (isBrowser) {
        const initPerspective = async () => {
          await import("@finos/perspective-viewer");
          await import("@finos/perspective-viewer-datagrid");
          await import("@finos/perspective-viewer-d3fc");
          const perspective = await import("@finos/perspective");

          const worker = await perspective.default.worker();

          const config /*: PerspectiveViewerConfig */ = {
            group_by: ["State"],
          };

          const getTable = async (): Promise<perspective.Table> => {
            const req = fetch("./superstore.lz4.arrow");
            const resp = await req;
            const buffer = await resp.arrayBuffer();
            return await worker.table(buffer);
          };

          const table = await getTable();
          if (viewerRef.value) {
            viewerRef.value.load(Promise.resolve(table));
            viewerRef.value.restore(config);
          }
        };
        initPerspective().catch((error) => {
          console.error("Error initializing Perspective:", error);
        });
      }
    })
  );

  return (
    <>
      <h1>Hi 👋</h1>
      <perspective-viewer ref={viewerRef}></perspective-viewer>
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
};
