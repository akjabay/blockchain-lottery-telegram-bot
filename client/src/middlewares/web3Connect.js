import Web3Wallet from "./web3Wallet";

let web3Wallet;

function init ({ hooks }) {
    web3Wallet = new Web3Wallet({ hooks });
}


export {
    web3Wallet,
    init
}