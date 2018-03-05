const Enzyme = require('enzyme'); // eslint-disable-line
const Adapter = require('enzyme-adapter-react-16'); // eslint-disable-line

Enzyme.configure({ adapter: new Adapter() });
