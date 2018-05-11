const NodeRSA = require('node-rsa')
const fs = require('fs')
const key = new NodeRSA({b: 512})
key.decrypt(key.encrypt(1234))

const keys = JSON.stringify({
    public: key.$cache['pkcs8-public-pem'],
    private: key.$cache['pkcs1-private-pem']
})
fs.writeFile('./functions/rsa-keys.json', keys, (err) => {
    if (err) throw err
    console.log('Success')
})
