exports['default'] = {

  /*
    The blockchain account keys used by the different components,
    Format:
      "accountID" : "private key",
    
    any smart agent or other component has its own 'ethAccounts' section,
    which will be merged into one object
  */
  ethAccounts: process.env.ETH_ACCOUNTS ? JSON.parse(process.env.ETH_ACCOUNTS) : {},
  
  eth: (api) => {
    return {
      provider: {
        // parity/geth endpoint
        url: process.env.ETH_WS_ADDRESS || 'ws://localhost:8546',
      },

      solc: {
        // should SOL files compiled on startup
        compileContracts: false,
      },
      signer: {
        // gas price to pay in wei
        // unset config value or set it to falsy for use median of last blocks as gas price
        gasPrice: 0,
        // if falsy only estimate gas limit if no gas option was provided
        // if truthy, ignore given gas value, 1.1 ==> adds 10% to estimated value
        alwaysAutoGasLimit: process.env.AUTO_GAS_LIMIT || 1.1,
      },
      nameResolver: {    
        ensAddress: process.env.ENS_ADDRESS || '0x937bbC1d3874961CA38726E9cD07317ba81eD2e1',
        ensResolver: process.env.ENS_RESOLVER || '0xDC18774FA2E472D26aB91deCC4CDd20D9E82047e',
        labels: {
          businessCenterRoot: process.env.BC_ROOT || 'testbc.evan',
          evanRoot: process.env.ENS_ROOT || 'evan',
          factory: 'factory',
          admin: 'admin',
          eventhub: 'eventhub',
          profile: 'profile',
          mailbox: 'mailbox'
        },
        domains: {
          root: ['evanRoot'],
          factory: ['factory', 'businessCenterRoot'],
          adminFactory: ['admin', 'factory', 'evanRoot'],
          businessCenter: ['businessCenterRoot'],
          eventhub: process.env.ENS_EVENTS || ['eventhub', 'evanRoot'],
          profile: process.env.ENS_PROFILES || ['profile', 'evanRoot'],
          profileFactory: ['profile', 'factory', 'evanRoot'],
          mailbox: process.env.ENS_MAILBOX || ['mailbox', 'evanRoot'],
        },
      }
    }
  }
}

exports.test = {
  tasks: (api) => {
    return {
      // do we need something here?
    }
  }
}
