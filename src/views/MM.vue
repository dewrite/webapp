<template>
  <div class="mm">
    <maintop title="MetaMask" />

    <el-row style="min-height: 100%">
      <el-col :span="5">&nbsp;</el-col>
      <el-col :span="14" class="header-out" style="">
        <!-- ################### layout start ###################  -->
        <el-button @click="getEncryptionPublicKey()">eth_getEncryptionPublicKey</el-button>
        <el-button @click="decrypt()">eth_decrypt</el-button>
        <el-button @click="addToken()">wallet_watchAsset</el-button>
        <el-button @click="personal_sign()">personal_sign</el-button>

        <!-- ################### layout end ################### -->
      </el-col>
      <el-col :span="5">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
import { mine } from '@/api/articles'
import maintop from './dashboard/maintop'
import debounce from '@/utils/debounce'
import { mapActions, mapMutations, mapState } from 'vuex'
import * as sigUtil from '@metamask/eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
 

export default {
  name: 'dashboard',
  components: {
    maintop,
  },
  data() {
    return {
      list: [],
      loading: false,
      noMore: false,
      PublicKey: '5lU3IWgykP9MajVQnnolLlud/SfK0mEVSXfqYs8YFFY=',
      page: {
        pageSize: 10,
        currentPage: 1,
      },
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.users.address,
      domain: (state) => state.users.domain,
    }),
  },
  methods: {
    ttt() {},
    async personal_sign() {
      const exampleMessage = 'Example `personal_sign` message'
      try {
        const from = this.address
        const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
        const sign = await ethereum.request({
          method: 'personal_sign',
          params: [msg, from, 'Example password'],
        })

        console.log(sign);
        const recoveredAddr = sigUtil.recoverPersonalSignature({
          data: msg,
          signature: sign,
        })
        if (recoveredAddr === from) {
          console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`)
        } else {
          console.log(`SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`)
          console.log(`Failed comparing ${recoveredAddr} to ${from}`)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getDecMsg() {
      const msg = 'rand-msg'
      // const encJson = sigUtil.encrypt(this.PublicKey, { data: msg }, 'x25519-xsalsa20-poly1305')
      // console.log(encJson)
      // const buf = Buffer.from(JSON.stringify(encJson), 'utf8')
      // const intxt = '0x' + buf.toString('hex')
      // return intxt
      const encryptedMessage = ethUtil.bufferToHex(
        Buffer.from(
          JSON.stringify(
            sigUtil.encrypt({
              publicKey: encryptionPublicKey,
              data: 'hello world!',
              version: 'x25519-xsalsa20-poly1305',
            })
          ),
          'utf8'
        )
      )
      return encryptedMessage
    },
    // 这是解密方法
    async decrypt() {
      const encryptedMessage = await this.getDecMsg()
      ethereum
        .request({
          method: 'eth_decrypt',
          params: [encryptedMessage, this.address],
        })
        .then((decryptedMessage) => console.log('The decrypted message is:', decryptedMessage))
        .catch((error) => console.log(error.message))
    },
    // 这是获取公钥方法,用于加密
    getEncryptionPublicKey() {
      ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [this.address], // you must have access to the specified account
        })
        .then((result) => {
          console.log(result)
          this.PublicKey = result
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("We can't encrypt anything without the key.")
          } else {
            console.error(error)
          }
        })
    },
    async addToken() {
      ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
              symbol: 'FOO',
              decimals: 18,
              image: 'https://foo.io/token-image.svg',
            },
          },
        })
        .then((success) => {
          if (success) {
            console.log('FOO successfully added to wallet!')
          } else {
            throw new Error('Something went wrong.')
          }
        })
        .catch(console.error)
    },
  },
}
</script>
<style scoped lang="scss"></style>
