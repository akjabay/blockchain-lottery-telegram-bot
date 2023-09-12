export function setAddress (state, address) {
    state.address = address;
    localStorage.setItem("address", JSON.stringify(address));
}
export function setNetwork (state, network) {
    state.network = network;
    localStorage.setItem("network", JSON.stringify(network));
}
