/* eslint-disable @typescript-eslint/ban-ts-ignore */
export const fs = jest.genMockFromModule('fs');

// When changing the ethereum node that is used, it is persisted to a config file.
// As tests should not write any data, this file write is mocked.
function readFileSync() {}

// @ts-ignore
fs.readFileSync = readFileSync;
