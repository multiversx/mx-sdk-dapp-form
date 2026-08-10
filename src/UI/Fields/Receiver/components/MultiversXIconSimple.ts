import type { FunctionComponent, SVGAttributes } from 'react';

import icon from '../../../../assets/icons/mx-icon-simple.svg';

/**
 * Explicitly annotated so the emitted declaration is self-contained. Without it, tsc
 * carries the raw asset specifier into the .d.ts, which consumers cannot resolve — the
 * ambient asset declarations in src/global.d.ts type the sources only.
 */
const MultiversXIconSimple: FunctionComponent<SVGAttributes<SVGElement>> = icon;

export default MultiversXIconSimple;
