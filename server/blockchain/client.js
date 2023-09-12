const { ethers } = require("ethers");
const api = require('./api');
const { TokenABI, ContractABI, tokens, receiver } = require('./constants');
const { WALLET_PRIVATE_KEY } = process.env;

module.exports = class Client {
    constructor(args = []) {
        const { node = 'default', token = 'testtoken', network = 4002 } = args;
        this._provider = new ethers.JsonRpcProvider(api[node][network].http);
        this._signer = new ethers.Wallet(WALLET_PRIVATE_KEY, this._provider);
        this._network = network;
        this._tokenAddress = tokens[token][this._network];
        this._mainContractAddress = receiver[this._network];
        this._tokenContract = new ethers.Contract(this._tokenAddress, TokenABI, this._provider);
        this._mainContract = new ethers.Contract(this._mainContractAddress, ContractABI, this._provider);
    }

    async getBalance({ address } = []) {
        const contract = this._tokenContract;

        const balance = await contract.balanceOf(address);

        return {
            balance,
            balanceFormatted: ethers.utils.formatEther(balance)
        }
    }

    // main contract
    async getPlayers() {
        const result = await this._mainContract.getPlayers();
        const players = {};

        if (result.length > 0) {
            const addresses = result[0];
            const amounts = result[1];

            addresses.forEach((address, index) => {
                players[address] = players[address]
                    ? players[address] + +ethers.formatEther(amounts[index])
                    : +ethers.formatEther(amounts[index]);
            });

        }

        return players;
    }

    async getDrawTime() {
        const start = await this._mainContract.getPlayStartTime();
        const wait = await this._mainContract.getDrawWaitTime();

        const startTime = ethers.formatUnits(start, 0) * 1000;

        if (startTime === 0) {
            return 'there is no active drawing now'
        }
        const waitTime = ethers.formatUnits(wait, 0) * 1000;

        const drawTime = startTime + waitTime;

        return new Date(drawTime);
    }

    async draw() {
        try {

            const canDraw = await this._mainContract.canDraw();

            if (!canDraw) {
                return 'You can not draw now. Please wait more to start draw'
            }

            const mainContract = new ethers.Contract(this._mainContractAddress, ContractABI, this._signer);

            const drawFunc = mainContract.getFunction('draw');
            const gasEstimate = await drawFunc.estimateGas();
            console.log(`Gas estimate for draw: ${gasEstimate.toString()}`);

            const tx = await drawFunc.send({
                gasLimit: gasEstimate, // Set the estimated gas limit
                gasPrice: ethers.parseUnits('10', 'gwei'), // Set a gas price
            });

            console.log('Transaction hash:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed');

            return receipt.hash;

        } catch (error) {
            console.error('Error estimating gas or sending transaction:', error);
        }
    }

    async getBalanceGeneral({ tokenAddress, contractAddress, address } = []) {
        const contract = tokenAddress
            ? new ethers.Contract(tokenAddress, TokenABI, this._provider)
            : new ethers.Contract(contractAddress, ContractABI, this._provider);

        const balance = await contract.balanceOf(address);

        return {
            balance,
            balanceFormatted: ethers.formatEther(balance)
        }
    }
}
