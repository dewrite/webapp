<template>
  <div>
    <el-progress
      :text-inside="true"
      :stroke-width="26"
      :percentage="percentage"
      status="success"
    ></el-progress>
    <div class="info">{{ task }}...</div>
  </div>
</template>

<script>
import { article, publish, deploy, ipfs } from '@/api/site'
import { updateModel } from '@/api/articles'

import { ethers } from 'ethers'
import DeWriteIo from '@/contracts/DeWriteIo.json'
import TokenPaymentSplitter from '@/contracts/TokenPaymentSplitter.json'

export default {
  name: 'BackgroundTaskComponent',
  data() {
    return {
      step: 0,
      percentage: 0,
      task: '发布文章',
      ipfs: '',
    }
  },
  props: ['uid', 'aid', 'nft'],
  async mounted() {
    try {
      this.percentage = 0
      const taskId = setInterval(() => {
        this.percentage += 2
        if (this.percentage > 25 && this.percentage <= 60) {
          this.task = '构建站点'
        } else if (this.percentage > 60 && this.percentage <= 90) {
          this.task = '部署站点'
        } else if (this.percentage > 90 && this.percentage <= 99) {
          this.task = '发布成功'
        } else if (this.percentage >= 100) {
          clearInterval(taskId)
          // this.$emit('close')
          // this.$emit('close-toast')
        }
      }, 300)

      // const res = await ipfs(this.aid)
      // console.log(res.data.data.ipfs);
      // this.ipfs = res.data.data.ipfs
      // this.mint()
      // this.$emit('close')
      // this.$emit('close-toast')

      Promise.all([article(this.aid), ipfs(this.aid)]).then(async (values) => {
        // console.log(values)
        await publish(this.uid)
        await deploy(this.uid)

        this.$emit('close')
        this.$emit('close-toast')
      })
      
      // 生成md，上传md到ipfs
      // await article(this.aid);
      // 编译站点，这个时间最长
      // await publish(this.uid);
      // await deploy(this.uid);
    } catch (e) {
      this.$emit('close')
      this.$emit('close-toast')
    }
  },
  methods: {
    
  },
}
</script>
<style lang="scss" scoped>
.info {
  padding-top: 10px;
  font-weight: bold;
}
</style>
