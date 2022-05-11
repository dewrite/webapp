<template>
  <div class="publish">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="验证签名"></el-step>
      <el-step title="发布NFT"></el-step>
      <el-step title="授权支付"></el-step>
      <el-step title="获得分红权"></el-step>
    </el-steps>

    <!-- ################### layout start ###################  -->
    <!-- <el-button @click="personal_sign()">验证签名</el-button>
    <el-button @click="mint()">发布NFT</el-button>
    <el-button @click="approve()">授权支付</el-button>
    <el-button @click="set_owner()">获得分红权</el-button> -->
    <br />
    <br />
    <div
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    ></div>
    <br />
    <br />
    <el-alert
      :closable="false"
      title="* 作者将文章发行为 NFT 需要 0.01 WETH。本项目暂时仅支持 Polygon 链。"
      type="success"
    ></el-alert>

    <el-alert
      :closable="false"
      title="* 发行 NFT 上链需要四个步骤，大概总用时 3 分钟，请耐心等待。"
      type="success"
    ></el-alert>
    
    <el-alert
      :closable="false"
      title="* 期间会多次弹出 MetaMask 授权或执行窗口，请注意操作。"
      type="success"
    ></el-alert>


    <el-alert
      :closable="false"
      title="* 其中的某步骤失败后可以重新尝试。"
      type="success"
    ></el-alert>

    <!-- ################### layout end ################### -->
  </div>
</template>

<script>
import { fetchId, updateModel, ethSetOwner } from '@/api/articles'
import { mapActions, mapMutations, mapState } from 'vuex'
import * as sigUtil from '@metamask/eth-sig-util'
import { ethers } from 'ethers'
import DeWriteIo from '@/contracts/DeWriteIo.json'
import TokenPaymentSplitter from '@/contracts/TokenPaymentSplitter.json'

export default {
  name: 'publish',
  components: {},
  props: ['id'],
  data() {
    return {
      active: 0,
      article: {},
      loading: true,
      stop : false,
    }
  },
  async mounted() {
    try {
      const res = await fetchId(this.id)
      if (res.data && res.data.code === 0) {
        this.article = res.data.data
        // console.log(this.article.pass)
        // console.log(this.article._id)
        if (this.article._id && this.article.pass) {
          await this.personal_sign()
          await this.mint()
          await this.approve()
          await this.set_owner()
          this.$toast.success('祝贺你，NFT发布成功！')
        }else{
          this.$toast.error('文章未发布，请先发布文章')
        }
      }else{
        this.$toast.error('文章没有找到')
      }
      this.$emit('close')
    } catch (error) {
      this.$emit('close')
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.users.address,
      domain: (state) => state.users.domain,
      signature: (state) => state.users.signature,
    }),
  },
  methods: {
    ...mapActions({
      update: 'users/update',
    }),
    ...mapMutations({
      setSignature: 'users/setSignature',
    }),
    ttt() {},
    async personal_sign() {
      if (this.signature || this.stop) {
        this.active = 1
        console.log(this.signature)
      } else {
        const exampleMessage = '你好，这是DeWrite网站的验证签名消息，请确认后继续操作。'
        try {
          const from = this.address
          const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
          const sign = await ethereum.request({
            method: 'personal_sign',
            params: [msg, from, 'dewrite.io'],
          })
          const recoveredAddr = sigUtil.recoverPersonalSignature({
            data: msg,
            signature: sign,
          })
          if (recoveredAddr === from) {
            this.$toast.success('签名验证成功')
            this.active = 1
            this.setSignature(recoveredAddr)
            await this.update({
              signature: recoveredAddr,
            })
          } else {
            this.$toast.error('签名验证错误')
          }
        } catch (err) {
          console.error(err)
          this.$toast.error(err.message)
          this.$emit('close')
          this.stop = true
        }
      }
    },
    async mint() {
      try {
        if (this.article.nft|| this.stop) {
          this.active = 2
          console.log(this.article.nft)
        } else {
          const { ethereum } = window
          if (ethereum && this.article.ipfs) {
            // console.log(this.nft, this.article.ipfs, process.env.VUE_APP_CONTRACT)
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
              process.env.VUE_APP_CONTRACT,
              DeWriteIo.abi,
              signer
            )
            const uri = 'https://gateway.pinata.cloud/ipfs/' + this.article.ipfs
            const tx = await contract.safeMint(uri)
            console.log(tx)
            const receipt = await tx.wait()
            let mintevent = receipt.events.find((event) => event.event === 'DeWriteMinted')
            let [sender, tokenId] = mintevent.args
            // console.log(uri)
            // console.log(tokenId)
            console.log(mintevent.args)
            await updateModel(this.id, {
              tx: process.env.VUE_APP_CONTRACT,
              nft: tokenId.toNumber(),
            })
            this.article.nft = tokenId.toNumber()
            this.active = 2
          }
        }
      } catch (error) {
        console.log(error)
        if (error.code === 4001) {
          this.$toast.error('用户拒绝交易')
        } else {
          this.$toast.error(error.message)
        }
        this.$emit('close')
        this.stop = true
      }
    },
    async approve() {
      try {
        if (this.article.approve|| this.stop) {
          this.active = 3
          console.log('approve' ,this.article.approve)
        } else {
          const { ethereum } = window
          if (ethereum && this.article.ipfs) {
            // console.log(this.nft, this.article.ipfs, process.env.VUE_APP_CONTRACT)
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const WETHAbi = [
              'function approve(address spender, uint256 amount) public returns (bool) ',
            ]
            const contract = new ethers.Contract(process.env.VUE_APP_WETH, WETHAbi, signer)
            const tx = await contract.approve(
              process.env.VUE_APP_BIZ,
              ethers.utils.parseEther('0.01')
            )
            // console.log(tx);
            const receipt = await tx.wait()
            // console.log(receipt.transactionHash);
            await updateModel(this.id, {
              approve: true,
            })
            this.active = 3
          }
        }
      } catch (error) {
        console.log(error)
        if (error.code === 4001) {
          this.$toast.error('用户拒绝交易')
        } else {
          this.$toast.error(error.message)
        }
        this.$emit('close')
        this.stop = true
      }
    },

    async set_owner() {
      try {
        if (this.article.owner|| this.stop) {
          this.active = 4
          console.log(this.article.owner)
        } else {
          const res = await ethSetOwner(this.id)
          if (res.data && res.data.code === 0) {
            this.article.owner = res.data.data.owner
            this.active = 4
          } else {
            this.$emit('close')
            this.stop = true
          }
        }
      } catch (error) {
        console.log(error)
        if (error.code === 4001) {
          this.$toast.error('用户拒绝交易')
        } else {
          this.$toast.error(error.message)
        }
        this.$emit('close')
        this.stop = true
      }
    },
  },
}
</script>
<style scoped lang="scss">
/deep/ .el-loading-spinner i{
  font-size: 30px;
}
</style>
