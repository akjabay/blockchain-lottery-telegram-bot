import * as Web3 from 'web3';
import { web3Modal } from './web3Modal';
import { checkApprove, onApprove, deposit, getTotalDeposit, checkBalance, getExactAmount, getPlayerCount, getDrawTime } from './interactions';
import { TokenABI, tokens, receiver, ContractABI } from './constants';


export default class Web3Wallet {
    constructor({ provider = null, hooks }) {
        this._hooks = hooks;
        this._provider = provider;
        this._allowance = {};
        this._contracts = {};
        this._receiver = {};
        Object.keys(tokens).forEach((key) => {
            this._contracts[key] = {}
        });
        Object.keys(receiver).forEach((networkId) => {
            this._receiver[networkId] = receiver[networkId];
        });
        if (this._provider) {
            this._walletAddress = provider.selectedAddress;
            this._web3 = new Web3(provider);
        } else {
            this.init();
        }
    }

    set provider(val) {
        this._provider = val;
    }
    get provider() {
        return this._provider;
    }

    async init() {

        try {
            await this.fetchAccountData();

        } catch (e) {
            console.log("Could not get a wallet connection", e);
            return;
        }

    }

    async fetchAccountData() {

        try {

            this._provider = await web3Modal.connect();
            this._web3 = new Web3(this._provider);
            this._provider.enable();

            // Subscribe to accounts change
            this._provider.on("accountsChanged", async (accounts) => {
                await this.fetchAccountData();
            });

            // Subscribe to chainId change
            this._provider.on("chainChanged", async (chainId) => {
                await this.fetchAccountData();
            });

            // Subscribe to networkId change
            this._provider.on("networkChanged", async () => {
                location.reload();
            });

            const accounts = await this._web3.eth.getAccounts();
            this._walletAddress = accounts[0];
            this._network = await this._web3.eth.net.getId()
            this._hooks.$store.dispatch('wallet/setAddress', this._walletAddress)
            this._hooks.$store.dispatch('wallet/setNetwork', this._network)

            if (this._hooks.$refs.route.init) {
                this._hooks.$refs.route.init()
            }
        } catch (error) {
            this.onError({ error })
        }
    }

    getContract({ symbol }) {
        symbol = symbol.toLowerCase();
        if (!this._web3) {
            this.fetchAccountData();
        }
        const contract = new this._web3.eth.Contract(TokenABI, tokens[symbol][this._network]);
        this._contracts[symbol] = contract;
        return this._contracts[symbol];
    }

    getMainContract() {
        if (!this._web3) {
            this.fetchAccountData();
        }
        const contract = new this._web3.eth.Contract(ContractABI, this._receiver[this._network]);
        this._contracts.main = contract;
        return this._contracts.main;
    }

    async onCheckBalance({ symbol }) {
        symbol = symbol.toLowerCase();

        const contract = this.getContract({ symbol });

        try {

            const balance = await checkBalance({
                walletAddress: this._walletAddress,
                receiver: this._receiver[this._network],
                symbol,
                network: this._network,
                contract
            });

            return this._web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            this.onError({ error })
        }
    }

    async getDrawTime() {

        const contract = this.getMainContract();

        const result = await getDrawTime({
            network: this._network,
            contract,
        });

        const startTime = +result.start * 1000;

        if (startTime === 0) {
            return false;
        }
        const waitTime = +result.wait * 1000;

        const drawTime = startTime + waitTime;

        return drawTime;



    }

    async onCheckApprove({ symbol }) {
        symbol = symbol.toLowerCase();

        const contract = this.getContract({ symbol });

        try {

            if (!this._allowance[symbol]) {
                this._allowance[symbol] = await checkApprove({
                    walletAddress: this._walletAddress,
                    receiver: this._receiver[this._network],
                    symbol,
                    network: this._network,
                    contract
                });
            }

            return this._web3.utils.fromWei(this._allowance[symbol], 'ether');
        } catch (error) {
            this.onError({ error })
        }
    }
    async onApprove({ symbol }) {
        symbol = symbol.toLowerCase();

        const contract = this.getContract({ symbol });

        try {

            this._hooks.$q.loading.show();

            if (!this._allowance[symbol]) {
                this._allowance[symbol] = await checkApprove({
                    walletAddress: this._walletAddress,
                    receiver: this._receiver[this._network],
                    symbol,
                    network: this._network,
                    contract
                });
            }

            if (this._allowance[symbol] == 0) {
                this._allowance[symbol] = await onApprove({
                    walletAddress: this._walletAddress,
                    receiver: this._receiver[this._network],
                    symbol,
                    network: this._network,
                    contract,
                    hooks: this,
                })

            }

            // to run after approve functions
            this._hooks.$q.notify({
                type: 'positive',
                message: 'token has approved'
            })
            this._hooks.$q.loading.hide();

            return this._allowance[symbol];

        } catch (error) {
            this.onError({ error })
        }

    }
    async onDeposit({ amount, symbol, ticketPrice }) {
        symbol = symbol.toLowerCase();
        const contract = this.getMainContract();

        try {

            this._hooks.$q.loading.show();

            const result = await deposit({
                walletAddress: this._walletAddress,
                amount,
                tokenAddress: tokens[symbol][this._network],
                symbol: symbol,
                network: this._network,
                contract,
                hooks: this,
            })

            if (result) {
                const numberOfTickets = Math.floor(amount / ticketPrice);
                this._hooks.$q.notify({
                    type: 'positive',
                    message: 'You have Bought '+ numberOfTickets + ' Tickets'
                })
                this._hooks.$q.loading.hide();

                return result
            } else {
                this._hooks.$q.notify({
                    type: 'negative',
                    message: 'there is a problem'
                })
                this._hooks.$q.loading.hide();
            }
            this._hooks.$q.loading.hide();


        } catch (error) {
            this.onError({ error })
        }

    }
    async onCheckTotalDeposit({ symbol }) {
        symbol = symbol.toLowerCase();
        const contract = this.getContract({ symbol });

        this._hooks.$q.loading.show();

        try {

            const result = await getTotalDeposit({
                receiver: this._receiver[this._network],
                tokenAddress: tokens[symbol][this._network],
                symbol: symbol,
                network: this._network,
                contract,
                hooks: this,
            })
            this._hooks.$q.loading.hide();
            
            return this._web3.utils.fromWei(result, 'ether');
            
        } catch (error) {
            this._hooks.$q.loading.hide();
            this.onError({ error });
        }

    }

    async onGetTicketPrice() {
        const contract = this.getMainContract();

        try {

            const result = await getExactAmount({
                contract,
                hooks: this,
            })
            
            return this._web3.utils.fromWei(result, 'ether');
            
        } catch (error) {
            this._hooks.$q.loading.hide();
            this.onError({ error });
        }

    }

    async onGetNumberOfPlayers() {
        const contract = this.getMainContract();

        try {

            const result = await getPlayerCount({
                contract,
                hooks: this,
            })
            
            return result;
            
        } catch (error) {
            this._hooks.$q.loading.hide();
            this.onError({ error });
        }

    }

    async onChangeNetwork() {
        await this._provider.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0x38",
                rpcUrls: ["https://bsc-dataseed.binance.org/","https://bsc-dataseed1.defibit.io"],
                chainName: "BSC Mainnet",
                nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18
                },
                blockExplorerUrls: ["https://bscscan.com/"]
            }]
        });
        location.reload();
     }

    /**
     * Disconnect wallet button pressed.
     */
    async onDisconnect() {

        console.log("Killing the wallet connection", this._provider);

        // TODO: Which providers have close method?
        if (this._provider.close) {
            await this._provider.close();

            // If the cached provider is not cleared,
            // WalletConnect will default to the existing session
            // and does not allow to re-scan the QR code with a new wallet.
            // Depending on your use case you may want or want not his behavir.
            web3Modal.clearCachedProvider();
            this._provider = null;
            this._web3 = null;
        }

        this._hooks.$store.dispatch('wallet/setAddress', null)

    }

    onError({ error }) {
        this._hooks.$q.loading.hide();
        this._hooks.$q.notify({
            type: 'negative',
            message: error.message
        })
    }

    onAlert({ type = "danger", message = "An Error has occurred!" } = []) {
        this._hooks.$q.loading.hide();
        this._hooks.$q.dialog({
            type,
            dark: true,
            title: 'Alert',
            message,
        }).onOk(() => {
            // console.log('OK')
        }).onCancel(() => {
            // console.log('Cancel')
        }).onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
        })
    }

}