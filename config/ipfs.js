 exports['default'] = {
  ipfs: (api) => {
    return {
      node: {
        repo: 'ipfs-evannetwork',
        start: true,
        config: {
          "Addresses": {
            "Swarm": [
            "/ip4/0.0.0.0/tcp/4004",
            "/ip4/127.0.0.1/tcp/4005/ws"
            ],
          },
        },
      },
      remoteNode: {
        host: 'ipfs.evan.network',
        port: '443',
        protocol: 'https',
      },
      peers: [],
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
