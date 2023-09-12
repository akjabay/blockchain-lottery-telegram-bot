
async function onApprove(args = []) {
    const {
        walletAddress, receiver, network, contract, symbol, hooks
    } = args;

    const val = 900000000 + parseInt((Math.random() * 1000).toFixed(0));
    const valStr = val + "000000000000000000";

    try {
        const gasPrice = await hooks._web3.eth.getGasPrice();
    
        const result = await contract.methods.increaseAllowance(receiver, valStr).send({
            from: walletAddress,
            gasPrice: gasPrice,
        });

        return valStr;
    } catch (error) {
        const err = new Error(error);
        console.log(err);
    }

}

async function getTotalDeposit(args = []) {
    const {
        receiver, network, contract, symbol, hooks
    } = args;


    try {
    
        const result = await contract.methods.balanceOf(receiver).call();

        return result;
    } catch (error) {
        const err = new Error(error);
        console.log(err);
    }

}

async function deposit(args = []) {
    const {
        amount, walletAddress, tokenAddress, network, contract, symbol, hooks,
    } = args;

    try {

        const valStr = amount + "000000000000000000";

        const gasPrice = await hooks._web3.eth.getGasPrice();
    
        const result = await contract.methods.enter(valStr)
            .send({
                from: walletAddress,
                gasPrice: gasPrice,
            });
        
        return result;
    } catch (error) {
        const err = new Error(error);
        console.log(err);
    }

}

async function checkBalance(args = []) {
    const {
        walletAddress, receiver, network, contract
    } = args;
    try {
        
        const balance = await contract.methods.balanceOf(walletAddress).call();

        return balance;

    } catch (error) {
        console.log(error)
    }
}

async function getExactAmount(args = []) {
    const {
        contract
    } = args;
    try {
        
        const amount = await contract.methods.getTicketPrice().call();

        return amount;

    } catch (error) {
        console.log(error)
    }
}

async function getPlayerCount(args = []) {
    const {
        contract
    } = args;
    try {
        
        const count = await contract.methods.playersCount().call();

        return count;

    } catch (error) {
        console.log(error)
    }
}

async function getDrawTime(args = []) {
    const {
        contract
    } = args;
    try {
        
        const start = await contract.methods.getPlayStartTime().call();
        const wait = await contract.methods.getDrawWaitTime().call();

        return { start, wait }
    } catch (error) {
        console.log(error)
    }
}

async function checkApprove(args = []) {
    const {
        walletAddress, receiver, network, contract
    } = args;
    try {
        
        const allowance = await contract.methods.allowance(walletAddress, receiver).call();

        return allowance;

    } catch (error) {
        console.log(error)
    }
}

export {
    onApprove,
    checkApprove,
    deposit,
    getTotalDeposit,
    checkBalance,
    getExactAmount,
    getPlayerCount,
    getDrawTime
}