<template>
  <span>
    <el-button
      v-if="networkStat"
      v-show="connectShow"
      type="primary"
      round
      @click="connectWallet()"
    >
      {{ walletBtu }} {{ address | shortAddress6 }}
    </el-button>

    <el-button v-else type="danger" round @click.native="switchNetwork()">
      请切换到 {{ networkName }} 网络
    </el-button>
  </span>
</template>
<script>
import { networks } from '@/networks'
import InstallMetaMask from './InstallMetaMask.vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Wallet',
  data() {
    return {
      walletBtu: this.$t('connect'),
      networkStat: true,
      connectShow: true,
      networkName: networks[process.env.VUE_APP_DEFAULT_NETWORK],
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.users.address,
      network: (state) => state.users.network,
    }),
    isMetaMaskInstalled() {
      const { ethereum } = window
      return Boolean(ethereum && ethereum.isMetaMask)
    },
  },
  created() {
    this.checkIfWalletIsConnected()
  },
  methods: {
    ...mapMutations({
      setAddress: 'users/setAddress', // this.$store.commit('increment')
      setNetwork: 'users/setNetwork',
    }),
    ...mapActions({
      signin: 'users/signin',
    }),
    updateAddress(addr) {
      this.setAddress(addr)
      this.signin(addr)
      this.walletBtu = '登录成功 '
    },
    // 检查钱包是否连接，登录，授权
    async checkIfWalletIsConnected() {
      const { ethereum } = window

      if (!this.isMetaMaskInstalled) {
        this.$toast.error(
          {
            component: InstallMetaMask,
            props: {
              info: this.$t('notInstall'),
            },
          },
          {
            position: 'top-center',
            timeout: 10 * 1000,
          }
        )
        this.connectShow = false
        return
      }

      try {
        if (!this.address) {
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
            console.log('chainChanged', _chainId)
            this.networkStat = process.env.VUE_APP_DEFAULT_NETWORK == _chainId
            this.setNetwork(networks[_chainId])
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async connectWallet() {
      this.checkIfWalletIsConnected()
      this.$toast(this.$t('connectSuccess'))
    },

    // 检查MM是否在正确的网络
    async switchNetwork() {
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
              if (process.env.VUE_APP_DEFAULT_NETWORK === '0x13881') {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x13881',
                      chainName: 'Mumbai',
                      rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                      nativeCurrency: {
                        name: 'Mumbai Matic',
                        symbol: 'MATIC',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://mumbai.polygonscan.com'],
                    },
                  ],
                })
              } else if (process.env.VUE_APP_DEFAULT_NETWORK === '0x89') {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x89',
                      chainName: 'Polygon Mainnet',
                      rpcUrls: ['https://polygon-rpc.com'],
                      nativeCurrency: {
                        name: 'Matic',
                        symbol: 'MATIC',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://www.polygonscan.com'],
                    },
                  ],
                })
              }
            } catch (error) {
              console.log(error)
            }
          }
          console.log(error)
        }
      } else {
        this.$toast.warning(this.$t('notmm'))
      }
    },
  },
}
</script>
