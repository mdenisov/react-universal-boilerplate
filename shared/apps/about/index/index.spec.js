import React from 'react';
import { render } from 'enzyme';

import About from './index';

describe('About', () => {
  test('render correctly', () => {
    const test = render(<About />);
    expect(test).toMatchSnapshot();
  });
});
