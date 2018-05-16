'use strict'
const {Initializer, api} = require('actionhero')
const IpfsServer = require('ipfs')
const IpfsRemoteServer = require('ipfs-api')
const {promisify} = require('util')


module.exports = class Ipfs extends Initializer {
  constructor () {
    super()
    this.name = 'ipfs'
    this.loadPriority = 2100
    this.startPriority = 2100
    this.stopPriority = 2100
    this.config = api.config.ipfs
  }

  async initialize () {
    return new Promise((resolve, reject) => {
      const node = new IpfsServer(this.config.node)
      node.on('start', async () => {
        try {
          await Promise.all(this.config.peers.map(peer => promisify(node.swarm.connect)(peer)))
          setTimeout(() => {
            const remoteNode = IpfsRemoteServer({
              host: this.config.remoteNode.host,
              port: this.config.remoteNode.port,
              protocol: this.config.remoteNode.protocol,
            })
            api.ipfs = { node, remoteNode }
            resolve()
          }, 5000)
        } catch (ex) {
          reject(ex)
        }
      })
      node.on('error', (err) => { reject(err); })
    })
  }

  async start () {}
  async stop () {
    await api.ipfs.node.stop()
  }
}
