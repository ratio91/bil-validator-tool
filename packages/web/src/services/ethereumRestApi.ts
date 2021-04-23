import axios from 'axios';

import { withoutTrailingSlashes } from '../utils/urlParser';

import { backendUrl } from '../config';

export const fetchEthereumNode = async () => {
  try {
    const response = await axios.get(`${withoutTrailingSlashes(backendUrl)}/ethereum/ethereumNode`);
    return { endpoint: response.data };
  } catch (error) {
    return { error: 'Ethereum.Errors.unexpected' };
  }
};

export const resetEthereumNode = async () => {
  try {
    const response = await axios.get(`${withoutTrailingSlashes(backendUrl)}/ethereum/defaultEthereumNode`);
    return { endpoint: response.data };
  } catch (error) {
    return { error: 'Ethereum.Errors.unexpected' };
  }
};

export const changeEthereumNode = async (endpoint: string) => {
  try {
    const response = await axios.put(
      `${withoutTrailingSlashes(backendUrl)}/ethereum/ethereumNode/${encodeURIComponent(endpoint)}`,
    );
    if (response.status === 200) return { newEndpoint: endpoint }; // statuscode is 200 -> endpoint changed successfully -> return endpoint from request
    return { error: 'Ethereum.Errors.changeNode' };
  } catch (error) {
    return { error: 'Ethereum.Errors.changeNode' };
  }
};
