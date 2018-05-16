'use strict'
const {Initializer, api} = require('actionhero')
const Web3 = require('web3')

module.exports = class Eth extends Initializer {
  constructor () {
    super()
    this.name = 'eth'
    // must run before blockchain-core initializer
    this.loadPriority = 2100
    this.startPriority = 2100
    this.stopPriority = 2100
  }

  async initialize () {
    // connect to web3
    let reconnecting = false
    const web3 = new Web3()
    let websocketProvider = new web3.providers.WebsocketProvider(api.config.eth.provider.url);
    websocketProvider.on('end', () => {
      api.log('Lost connection to Websocket, reconnecting in 1000ms');
      if (!reconnecting) {
        reconnecting = true;
        setTimeout(() => {
          websocketProvider._timeout();
          websocketProvider.reset();
          websocketProvider = new web3.providers.WebsocketProvider(api.config.eth.provider.url);
          web3.setProvider(websocketProvider);
          reconnecting = false;
        }, 1000);
      }
    });    
    web3.setProvider(websocketProvider)

    api['eth'] = {
      web3
    }
  }

  async start () {}
  async stop () {}
}
