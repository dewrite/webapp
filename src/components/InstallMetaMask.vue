<template>
  <div @click="install">{{ info }}</div>
</template>

<script>
export default {
  name: "InstallMetaMask",
  props: ["info"],
  methods: {
    install () {
      window.open('https://metamask.io/')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  cursor: pointer;
}
</style>