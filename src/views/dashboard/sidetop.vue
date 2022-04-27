<template>
  <el-row class="wallet">
    <el-col :span="8">
      <el-badge is-dot type="success">
        <el-avatar :size="55" :src="avatar"></el-avatar>
      </el-badge>
    </el-col>
    <el-col :span="16">
      <span class="address"> {{address | shortAddress6 }}</span>
      <span class="name"> {{ title }}</span>
    </el-col>
  </el-row>
</template>
<script>
import { networks } from '@/networks'
import { mapActions, mapMutations, mapState } from "vuex";


export default {
  data () {
    return {
      networkStat: true,
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      address: state => state.users.address,
      title: state => state.users.title,
      network: state => state.users.network,
      avatar: state => state.users.avatar,
    }),
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
    },
    // 检查钱包是否连接，登录，授权
    async checkIfWalletIsConnected () {
      const { ethereum } = window
      if (!Boolean(ethereum && ethereum.isMetaMask)) {
        this.$router.push('/')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        this.updateAddress(accounts[0])
      }

      // This is the new part, we check the user's network chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      this.setNetwork(networks[chainId])

      this.networkStat = process.env.VUE_APP_DEFAULT_NETWORK == chainId

      ethereum.on('chainChanged', (_chainId) => {
        this.networkStat = process.env.VUE_APP_DEFAULT_NETWORK == _chainId
        this.setNetwork(networks[_chainId])
      })
    },
  },
}
</script>
<style scoped>
.wallet {
  border-bottom: solid 2px #00000008;
  padding: 16px;
}
.address{
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  text-align: center;
}
.name{
  font-size: 1rem;
  font-weight: bold;
}

</style>
