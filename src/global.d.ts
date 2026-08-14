/**
 * Ambient declarations for the asset imports in src/. These type the *sources* only —
 * the build resolves .scss/.svg through the module graph, so nothing in the published
 * `.d.ts` files refers to them.
 */

declare module '*.scss' {
  const content: Record<any, any>;
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';

  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
