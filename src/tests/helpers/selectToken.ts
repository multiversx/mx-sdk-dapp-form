import { queries, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

export const selectToken = async (
  methods: RenderResult<typeof queries, HTMLElement, HTMLElement>,
  identifier: string
) => {
  selectEvent.openMenu(await methods.findByLabelText('Token'));

  // the test id sits on a wrapper around react-select's own Option
  const option = await methods.findByTestId(`${identifier}-option`);
  await userEvent.click((option.firstElementChild as HTMLElement) ?? option);

  return option;
};
