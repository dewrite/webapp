<template>
  <div>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" status="success"></el-progress>
    <div class="info">{{ task }}...</div>
  </div>
</template>

<script>
import { article, publish, deploy } from '@/api/site'

export default {
  name: "BackgroundTaskComponent",
  data () {
    return {
      step: 0,
      percentage: 0,
      task: '发布文章'
    }
  },
  props: ["uid", "aid"],
  async mounted () {
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
          this.$emit('close')
          this.$emit('close-toast')
        }
      }, 300);

      await article(this.aid);

      await publish(this.uid);

      await deploy(this.uid);
      this.$emit('close')
      this.$emit('close-toast')
    } catch (e) {
      this.$emit('close')
      this.$emit('close-toast')
    }


  },
}
</script>
<style lang="scss" scoped>
.info {
  padding-top: 10px;
  font-weight: bold;
}
</style>