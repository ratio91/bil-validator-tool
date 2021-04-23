/* eslint-disable @typescript-eslint/ban-ts-ignore */
const mockAxios = jest.genMockFromModule('axios');

// this is the key to fix the axios.create() undefined error!
// @ts-ignore
mockAxios.create = jest.fn(() => mockAxios);

export default mockAxios;
