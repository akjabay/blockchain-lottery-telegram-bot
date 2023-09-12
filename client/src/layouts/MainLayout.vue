<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title> DApp </q-toolbar-title>

        <div>
          <q-btn
            no-caps
            v-if="!wallet.address"
            color="primary"
            @click="onConnect"
          >
            Connect Wallet
          </q-btn>
          <q-btn-dropdown no-caps unelevated v-else color="blue-grey" text-color="white">
            <template v-slot:label>
              <div class="row">
                <div v-if="wallet.network !== 56" class="col-3 q-pr-sm">
                  <q-icon class="text-yellow-8" name="warning" />
                </div>
                <div v-else class="col-3 q-pr-sm">
                  <q-icon class="text-green" name="done" />
                </div>
                <div class="col-9">
                  {{
                    wallet.address.slice(0, 4) +
                    "..." +
                    wallet.address.slice(
                      wallet.address.length - 4,
                      wallet.address.length
                    )
                  }}
                </div>
              </div>
            </template>
            <q-list class="">
              <q-item>
                <q-item-section avatar>
                  <q-avatar icon="person" color="blue-grey" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    wallet.address.slice(0, 4) +
                    "..." +
                    wallet.address.slice(
                      wallet.address.length - 4,
                      wallet.address.length
                    )
                  }}</q-item-label>
                  <q-item-label caption>{{
                    {
                      4002: "Fantom Testnet",
                      97: "BNB Chain Testnet",
                      1: "Ethereum",
                      5: "Ethereum Testnet Görli",
                      56: "BNB Chain Mainnet",
                    }[wallet.network]
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-if="wallet.network !== 56"/>
              <q-item
                v-if="wallet.network !== 56"
                clickable
                v-close-popup
                @click="onChangeNetwork"
              >
                <q-item-section>
                  <q-item-label>
                    <q-icon size="sm" class="text-red-8" name="warning" />
                    Change Network
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onDisconnectWallet">
                <q-item-section>
                  <q-item-label>
                    <q-icon size="sm" name="logout" />
                    Disconnect
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view ref="route"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import { init, web3Wallet } from "../middlewares/web3Connect";

export default {
  name: "MainLayout",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["wallet"]),
  },
  methods: {
    onConnect: function () {
      if (!this.wallet.address) {
        init({ hooks: this });
      }
    },
    onChangeNetwork: function () {
      if (web3Wallet) {
        web3Wallet.onChangeNetwork();
      }
    },
    onDisconnectWallet: function () {
      if (web3Wallet) {
        web3Wallet.onDisconnect();
      }
    },
    onOpenLink(url) {
      window.open(url);
    },
  },
  mounted() {
    init({ hooks: this });
  },
};
</script>
