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
  methods: {
    ...mapMutations({
      setAddress: "users/setAddress", // this.$store.commit('increment')
      setNetwork: "users/setNetwork"
    }),
  },
}
</script>
<style scoped>
.wallet {
  border-bottom: solid 2px #00000008;
  padding: 16px;
}
.address {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  text-align: center;
}
.name {
  font-size: 1rem;
  font-weight: bold;
}
.el-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
