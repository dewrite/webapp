<template>
  <div class="title">
    {{ title }}
  </div>
</template>
<script>
export default {
  name: "maintop",
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
}
</script>
<style scoped>
.title {
  width: 100%;
  padding: 16px;
  height: 95px;
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  border-bottom: solid 2px #00000008;
}
</style>