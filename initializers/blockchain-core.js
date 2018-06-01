'use strict'
const {Initializer, api} = require('actionhero')
const sharedLib = require('@evan.network/blockchain-core')


module.exports = class BlockchainCore extends Initializer {
  constructor () {
    super()
    this.name = 'blockchain-core'
    // requires the eth initializer to run before
    this.loadPriority = 2200
    this.startPriority = 2200
    this.stopPriority = 2200
  }

  async initialize () {
    const contractLoader = new sharedLib.ContractLoader({
      contracts: api.solc.getContracts(),
      log: api.log,
      web3: api.eth.web3,
    });
    const accountStore = new sharedLib.AccountStore({
      log: api.log,
      accounts: api.config.ethAccounts,
    });

    const signer = new sharedLib.SignerInternal({
      config: api.config.eth.signer,
      log: api.log,
      contractLoader,
      web3: api.eth.web3,
      accountStore,
    });

    const executor = new sharedLib.Executor({
      log: api.log,
      signer,
      web3: api.eth.web3,
    });
    const nameResolver = new sharedLib.NameResolver({
      log: api.log,
      config: api.config.eth.nameResolver,
      executor,
      contractLoader,
      signer,
      web3: api.eth.web3,
    });
    const eventHub = new sharedLib.EventHub({
      config: api.config.eth.nameResolver,
      contractLoader,
      log: api.log,
      nameResolver: nameResolver,
    });
    await executor.init({
      eventHub,
    })
    const ipfs = new sharedLib.Ipfs({ node: api.ipfs.node, remoteNode: api.ipfs.remoteNode, log: api.log, })
    const cryptor = new sharedLib.Aes();
    const cryptoConfig = {};
    const defaultCryptoAlgo = 'aes';
    cryptoConfig['aes'] = cryptor;
    cryptoConfig['unencrypted'] = new sharedLib.Unencrypted();
    cryptoConfig['aesEcb'] = new sharedLib.AesEcb();
    const cryptoProvider = new sharedLib.CryptoProvider(cryptoConfig);
    const keyProvider = new sharedLib.KeyProvider(api.config.encryptionKeys);
    const ipld = new sharedLib.Ipld({
      ipfs,
      keyProvider,
      cryptoProvider,
      defaultCryptoAlgo,
      originator: '',
    });

    const definition = new sharedLib.Description({
      contractLoader,
      cryptoProvider,
      dfs: ipfs,
      executor,
      nameResolver,
    });

    const sharing = new sharedLib.Sharing({
      contractLoader,
      cryptoProvider,
      definition,
      executor,
      dfs: ipfs,
      keyProvider,
      nameResolver,
      defaultCryptoAlgo: 'aes',
    });


    const dataContract = new sharedLib.DataContract({
      cryptoProvider,
      dfs: ipfs,
      executor,
      loader: contractLoader,
      nameResolver: nameResolver,
      sharing,
      web3: api.eth.web3,
      definition,
    });

    api['bcc'] = {
      accountStore,
      contractLoader,
      cryptoProvider,
      defaultCryptoAlgo,
      eventHub,
      executor,
      ipld,
      ipfs,
      keyProvider,
      nameResolver,
      dataContract,
      signer
    }
  }

  async start () {


  }
  async stop () {}
}
