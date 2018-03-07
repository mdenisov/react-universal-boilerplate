import React from 'react';
import { render } from 'enzyme';

import Home from './index';

describe('Home', () => {
  test('render correctly', () => {
    const test = render(<Home />);
    expect(test).toMatchSnapshot();
  });
});
