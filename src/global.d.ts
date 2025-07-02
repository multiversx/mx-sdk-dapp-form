declare module '*.scss' {
  const content: Record<any, any>;
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
