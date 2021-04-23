/**
 * This config file is used to define which endpoint is used for a specific ecmr document.
 * The first three digits of an eid defines the company that is responsible for an ecmr document.
 * Therefore the companyId is used to infer the corresponding rest endpoint that can be used to download the ecmr document.
 * The following data structure defines the mapping between companyIds and responsible rest endpoints.
 */
let restConfig: { [id: string]: string } = {};

export const setRestConfig = (newConfig: { [id: string]: string }) => {
  restConfig = newConfig;
};

export const getRestConfig = (id: string) => {
  return restConfig[id];
};

export default getRestConfig;
