const { INFURA_API_KEY, QUCKNODE_API_NAME, QUCKNODE_API_KEY } = process.env;

module.exports.default = {
    4002: {
        http: `https://endpoints.omniatech.io/v1/fantom/testnet/public`,
    }
}

module.exports.quickNode = {
    97: {
        http: `https://${QUCKNODE_API_NAME}.bsc-testnet.discover.quiknode.pro/${QUCKNODE_API_KEY}/`,
        ws: `wss://${QUCKNODE_API_NAME}.bsc-testnet.discover.quiknode.pro/${QUCKNODE_API_KEY}/`,
    }
}

module.exports.infura = {
    1: {
        http: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    }
}
