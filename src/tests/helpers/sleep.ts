import { act } from '@testing-library/react';

/**
 * Lets pending timers (debounced amount/gas recalculations, username lookups) fire and
 * lets React process whatever they schedule.
 *
 * The wait runs inside `act` on purpose: these timers land outside any interaction, so an
 * unwrapped wait leaves React warning that the resulting state updates were not wrapped in
 * act(...) — once per timer, which drowns the test output.
 */
export const sleep = (ms: number = 1000) =>
  act(() => new Promise((resolve) => setTimeout(resolve, ms)));
