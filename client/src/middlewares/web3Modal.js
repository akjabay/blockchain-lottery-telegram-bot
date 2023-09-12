import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
const infura_key = "6ec965132a6e4a4c8dfe24e83e48a259";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            bridge: "https://uniswap.bridge.walletconnect.org",
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: infura_key,
        }
    },
};
const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});

export {
    web3Modal
}