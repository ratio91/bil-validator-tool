import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import config from '../config/config';
import promiseWithTimeout from '../utils/promiseWithTimeout';
import contractAbi from '../config/contract.abi';
import { EcmrEventData } from './dto/ecmr-event-data';

const WEB_APP = process.env.WEB_APP || false;
const USERDATA_PATH = process.env.USERDATA_PATH || null;

/** The EthereumService class implements methods for changing the web3 provider of the service and retrieving the eCMR hashes from the ethereum blockchain. */
@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);

  private defaultNode = config.infuraEndpoint;

  private _web3Endpoint = this.defaultNode;

  private ws_options = {
    timeout: 5000, // ms
    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false,
    },
  };

  private http_options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 5000, // ms
  };

  private readonly web3 = new Web3();

  private readonly contractAddress = config.contractAddress;

  private readonly contractInstance = new this.web3.eth.Contract(contractAbi, this.contractAddress);

  constructor() {
    if (!WEB_APP && USERDATA_PATH) {
      try {
        this._web3Endpoint = fs.readFileSync(path.join(USERDATA_PATH, 'ethereumNode.json')).toString();
      } catch (e) {
        this.logger.log(`could not read custom ethereum node config, using default value`);
        fs.writeFile(path.join(USERDATA_PATH, 'ethereumNode.json'), this.defaultNode, (err) => {
          if (err) {
            this.logger.log('failed to write ethereumNode.json', err.message);
          }
        });
      }
    }
    this.setProvider(this._web3Endpoint);
  }

  /**
   * Returns the current endpoint that is used to connect to the ethereum network.
   * @return {string} The current web3Endpoint.
   */
  getEthereumNode(): string {
    this.logger.log(`getEthereumNode() returns ${this._web3Endpoint}`);
    return this._web3Endpoint;
  }

  isUsingDefaultEthereumNode(): boolean {
    return this._web3Endpoint === this.defaultNode;
  }

  /**
   * Returns the connectionState, that indicates whether the backend is currently connected to the ethereum network
   * Usually the function should return right away, however in some cases (e.g. during connection establishment) it might wait
   * until the connectionState can actually be determined. When a maximum time is specified via the timeout parameter it returns
   * false when the timeout occures before the connectionState is known.
   * @param {number} timeoutMs Defines the maximum time (in milliseconds) the function is allowed to take.
   * @return {boolean} Current connectionState.
   */
  async isConnected(timeoutMs = 5000): Promise<boolean> {
    this.logger.log(`isConnected(timeoutMs: ${timeoutMs})`);
    try {
      return await promiseWithTimeout<boolean>(timeoutMs, this.web3.eth.net.isListening);
    } catch (err) {
      this.logger.log(`isConnected returns false - err was: ${err}`);
      return false; // is thrown e.g. when provider/endpoint refuses connection
    }
  }

  /**
   * Wrapper class for web3.setProvider function, since we need specific provider options for different protocols (e.g. for autoreconnect for websockets).
   * @param {string} newProvider The new endpoint that should be used to connect to the ethereum network.
   * @throws {Error} Throws an error in case the provided endpoint malformed.
   */
  private setProvider(newProvider: string) {
    if (newProvider.startsWith('ws')) {
      this.logger.log(`setProvider(newProvider: ${newProvider}) --> websocket options`);
      this.web3.setProvider(new Web3.providers.WebsocketProvider(newProvider, this.ws_options));
    } else if (newProvider.startsWith('http')) {
      this.logger.log(`setProvider(newProvider: ${newProvider}) --> http options`);
      this.web3.setProvider(new Web3.providers.HttpProvider(newProvider, this.http_options));
    } else {
      this.logger.log(`setProvider(newProvider: ${newProvider}) --> generic`);
      this.web3.setProvider(newProvider); // throws exception when new provider is malformatted
    }
  }

  /**
   * Changes the endpoint that is used to connect to the ethereum network.
   * @param {string} newProvider The new endpoint that should be used to connect to the ethereum network.
   * @throws {Error} Throws an error in case the provided endpoint was invalid or didn't accept a web3 connection.
   */
  async changeEthereumNode(newProvider: string) {
    this.logger.log(`changeEthereumNode(newProvider: ${newProvider})`);
    try {
      this.setProvider(newProvider); // throws exception when new provider is malformatted
    } catch (err) {
      this.logger.error(`Malformed web3 provider (${newProvider})!`);
      throw new Error('Malformed web3 provider!');
    }
    // no exception -> new provider is successfully set, however web3 doesn't check if you can actually connect to it... >.<

    const connected = await this.isConnected();
    if (connected) {
      // successfully connected to new provider
      this.logger.log(`changeEthereumNode successfully changed web3 provider to ${newProvider}`);
      this._web3Endpoint = newProvider; // update internal provider variable
      if (!WEB_APP && USERDATA_PATH) {
        try {
          fs.writeFileSync(path.join(USERDATA_PATH, 'ethereumNode.json'), this._web3Endpoint);
        } catch (e) {
          this.logger.log('could not write ethereumNode to file, old value will be used on reload');
        }
      }
    } else {
      this.setProvider(this._web3Endpoint);
      this.logger.error(`Cannot connect to provided web3 provider, fallback to previous one (${this._web3Endpoint})!`);
      throw new Error('Cannot connect to provided web3 provider, fallback to previous one!');
    }
  }

  /**
   * Changes the endpoint that the default value.
   * @throws {Error} Throws an error in case the provided endpoint was invalid or didn't accept a web3 connection.
   */
  async resetEthereumNode() {
    await this.changeEthereumNode(this.defaultNode);
    return this.defaultNode;
  }

  /**
   * Fetches the event data for the requested eCMR document from the blockchain and returns it.
   * @throws {Error} Throws an error when there is no event for the id or when inconsistent hashes are found on the blockchain.
   * @return {string} The found eCMR data containing eCMR and pdf hashes.
   */
  async getEcmrEventData(id: string, ecmrHash: string, pdfHash?: string): Promise<EcmrEventData> {
    this.logger.log(`getEcmrEventData(id: ${id})`);
    // so far no performance issues were found and the function seems to return almost instantly
    // in case it needs to fetch events that were emitted a long time ago or in case the contract already has emitted a lot of events that might change
    // when the method seems laggy the issue can be fixed by restricting the query to certain block numbers (from and to param at getPastEvents)
    // https://github.com/monosux/ethereum-block-by-date could be used to determine the blockNumbers that are relevant for the requested contract (by its timestamp)

    let foundEvents: EventData[] = [];

    const hashFilter = pdfHash ? { pdfHash } : { ecmrHash };

    try {
      // @ts-ignore
      foundEvents = await this.contractInstance.getPastEvents('EcmrUpdate', {
        filter: hashFilter,
        fromBlock: 23973971,
        toBlock: 'latest',
      });
    } catch (err) {
      this.logger.error(`Error when retrieving eCMR events for eCMR (eid: ${id}) from the blockchain`);
      throw new Error('Error when retrieving eCMR events from blockchain');
    }

    if (_.isEmpty(foundEvents)) {
      // in case no events for that Id are found on the blockchain, throw error
      this.logger.error(`No hash for the requested eCMR (eid: ${id}) was found on the blockchain`);
      throw new Error('No hash for the requested id was found on the blockchain');
    } else if (foundEvents.length > 1) {
      this.logger.log(`Multiple events for the requested eCMR (eid: ${id}) were found on the blockchain`);
    }

    // extract the hash value of the event array
    const foundEcmrHash = foundEvents[0].returnValues.ecmrHash;
    const foundPdfHash = foundEvents[0].returnValues.pdfHash;

    this.logger.log(`getEcmrEventData returns (foundEcmrHash: ${foundEcmrHash}, foundPdfHash: ${foundPdfHash})`);
    return new EcmrEventData(foundEcmrHash, foundPdfHash);
  }
}
