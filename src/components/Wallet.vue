<template>
  <span>
    <span class="network-info">

      <badge v-if="networkStat" type="default">{{ network }}</badge>
      <badge v-else type="warning" @click.native="switchNetwork()">{{ network }}</badge>

    </span>
    <a @click="connectWallet()" tabindex class="btn btn-icon" :class="walletColor">
      <span class="btn-inner--icon">
        <i class="fa mr-2" :class="walletStat"></i>
      </span>
      <span class="nav-link-inner--text"> {{ walletBtu }} {{address | shortAddress}}</span>
    </a>
  </span>
</template>
<script>
import { networks } from '@/networks'
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data () {
    return {
      msg: 'This is demo net work',
      walletBtu: this.$t('connect'),
      walletStat: 'fa-circle-o',
      walletColor: 'btn-neutral',
      networkStat: true,
    }
  },
  computed: {
    ...mapState({
      address: state => state.users.address,
      network: state => state.users.network,
    }),
    isMetaMaskInstalled () {
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    }
  },
  created () {
    this.checkIfWalletIsConnected()
  },
  methods: {
    ...mapMutations({
      setAddress: "users/setAddress", // this.$store.commit('increment')
      setNetwork: "users/setNetwork"
    }),
    ...mapActions({
      signin: 'users/signin'
    }),
    updateAddress (addr) {
      this.setAddress(addr)
      this.signin(addr)
      this.walletBtu = ''
      this.walletStat = 'fa-circle'
      this.walletColor = 'btn-info'
    },
    // 检查钱包是否连接，登录，授权
    async checkIfWalletIsConnected () {
      const { ethereum } = window

      if (!this.isMetaMaskInstalled) {
        this.$toast.warning(this.$t('notmm'));
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      this.updateAddress(accounts[0])

      // This is the new part, we check the user's network chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      this.setNetwork(networks[chainId])

      this.networkStat = process.env.VUE_APP_DEFAULT_NETWORK == chainId

      // console.log(ethereum.isMetaMask);
      // console.log(ethereum.networkVersion);
      // console.log(ethereum.selectedAddress);

      ethereum.on('chainChanged', (_chainId) => {
        this.networkStat = process.env.VUE_APP_DEFAULT_NETWORK == _chainId
        this.setNetwork(networks[_chainId])
      })
    },

    async connectWallet () {
      this.checkIfWalletIsConnected()
      this.$toast(this.$t('connectSuccess'));
    },

    // 检查MM是否在正确的网络
    async switchNetwork () {
      const { ethereum } = window
      if (ethereum) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: process.env.VUE_APP_DEFAULT_NETWORK }],
          })
        } catch (error) {
          if (error.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13881',
                    chainName: 'Polygon Mumbai Testnet',
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    nativeCurrency: {
                      name: 'Mumbai Matic',
                      symbol: 'MATIC',
                      decimals: 18,
                    },
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                  },
                ],
              })
            } catch (error) {
              console.log(error)
            }
          }
          console.log(error)
        }
      } else {
        this.$toast.warning(this.$t('notmm'));
      }
    }

    // onComplete(data) {
    //   // console.log('data:', data)
    //   if (data) {
    //     this.walletBtu = 'Connected: ' + this.shortAddress(data.metaMaskAddress)
    //     this.walletStat = 'fa-circle'
    //     this.walletColor = 'btn-info'
    //     console.log(data.type, data.netID)
    //   }
    // },
    // connect() {
    //   this.$refs.metamask.init()
    // },
  },
}
</script>
<style scoped>
.network-info {
  margin-right: 10px;
}
</style>
