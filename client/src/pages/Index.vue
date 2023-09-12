<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-11">
        <q-card flat bordered class="rounded-borders bg-grey-2">
          <q-card-section>
            <div class="text-h6">Deposit</div>
            <div class="text-subtitle2" style="opacity: 70%">
              ticket price is {{ ticketPrice }} testToken
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-xs-12 col-sm-12 col-md-12 bg-white q-pa-sm text-right">
                <span style="opacity: 70%">{{ balance }}</span>
                <img class="q-px-xs" width="20px" src="../assets/token.png" />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-input
                  outlined
                  class="bg-white q-pt-sm q-pb-lg"
                  type="number"
                  label="You Pay"
                  placeholder="USDT"
                  name="amount"
                  :hint="inputHint"
                  v-model="amount"
                  v-on:keyup="onChangeInput"
                >
                  <template v-slot:append>
                    <q-avatar>
                      <img width="30px" src="../assets/token.png" />
                    </q-avatar>
                  </template>
                </q-input>

                <div class="text-center">
                  <q-btn
                    no-caps
                    color="primary"
                    class="full-width"
                    :disabled="isBtnDisabled"
                    @click="onSubmit"
                    >{{ mode }}</q-btn
                  >
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-mt-md">
      <div class="col-md-4 col-sm-6 col-xs-11">
        <q-card flat bordered class="rounded-borders">
          <q-card-section>
            <div class="text-h6">Status</div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-6 text-body1" style="opacity: 70%">Contract Balance</div>
              <div class="col-6 text-body1 text-right">
                <span class="text-h6">{{ totalContractBalance }}</span>
                <img class="q-px-xs" width="25px" src="../assets/token.png" />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-6 text-body1" style="opacity: 70%">Number of Players</div>
              <div class="col-6 text-body1 text-right">
                <span class="text-h6">{{ playersCount }}</span>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-6 text-body1" style="opacity: 70%">Draw Time</div>
              <div class="col-6 text-body1 text-right">
                <span class="">{{ drawTime ? new Date(drawTime): 'Draw is not Active now' }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { init, web3Wallet } from "../middlewares/web3Connect";

export default {
  name: "PageIndex",
  data: () => ({
    amount: undefined,
    mode: "submit",
    isBtnDisabled: true,
    inputHint: "",
    balance: undefined,
    totalContractBalance: "",
    playersCount: "",
    ticketPrice: "",
    drawTime: false
  }),
  computed: {
    ...mapState(["wallet"]),
  },
  methods: {
    checkBtn: function () {
      if (!web3Wallet || !this.amount) {
        this.isBtnDisabled = true;
      } else {
        this.isBtnDisabled = true;
      }
    },
    onSubmit: async function () {
      if (web3Wallet) {
        if (this.mode === "submit") {
          await web3Wallet.onDeposit({
            amount: this.amount,
            ticketPrice: this.ticketPrice,
            symbol: "testToken",
          });
        } else if (this.mode === "approve") {
          console.log("approving ...");
          const result = await web3Wallet.onApprove({ symbol: "testToken" });
          if (result) {
            this.mode = "submit";
          }
        }
      } else if (this.mode === "connect wallet") {
        init({ hooks: this });
        this.mode = "approve";
      }
    },
    async onChangeInput() {
      this.checkBtn();
      this.onCheckApprove();
      this.onCheckBalance();
    },
    async onCheckApprove() {
      if (web3Wallet) {
        this.isBtnDisabled = true;
        const approvement = await web3Wallet.onCheckApprove({
          symbol: "testToken",
        });

        if (approvement < this.amount) {
          this.mode = "approve";
        } else {
          this.mode = "submit";
        }
        this.isBtnDisabled = false;
      }
    },
    async onCheckBalance() {
      if (web3Wallet) {
        this.isBtnDisabled = true;
        const balance = await web3Wallet.onCheckBalance({
          symbol: "testToken",
        });

        this.balance = balance;

        if (+balance < +this.amount) {
          this.inputHint = "your balance is low";
          this.isBtnDisabled = true;
        } else {
          this.inputHint = "";
          this.isBtnDisabled = false;
        }
      }
    },
    async onCheckTotalDeposit() {
      if (web3Wallet) {
        const result = await web3Wallet.onCheckTotalDeposit({
          symbol: "testToken",
        });
        this.totalContractBalance = result;
      }
    },
    async onGetTicketPrice() {
      if (web3Wallet) {
        const result = await web3Wallet.onGetTicketPrice();
        this.ticketPrice = result;
      }
    },
    async onGetNumberOfPlayers() {
      if (web3Wallet) {
        const result = await web3Wallet.onGetNumberOfPlayers();
        this.playersCount = result;
      }
    },
    async getDrawTime() {
      if (web3Wallet) {
        const result = await web3Wallet.getDrawTime();
        if (result) {
          this.drawTime = result;
        }
      }
    },
    async init() {
      this.onGetTicketPrice();
      this.onCheckBalance();
      this.onCheckApprove();
      this.onCheckTotalDeposit();
      this.onGetNumberOfPlayers();
      this.getDrawTime();
    },
  },
  async mounted() {
    this.checkBtn();
  },
};
</script>
