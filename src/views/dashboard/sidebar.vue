<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical" router>

    <el-menu-item index="/dashboard" >
        <i class="iconfont icon-fabiaowenzhang"></i>
        <span slot="title">文章</span>
    </el-menu-item>

    <el-menu-item index="/write">
      <i class="iconfont icon-line-quillpenyumaobi"></i>
      <span slot="title">写作</span>
    </el-menu-item>

    <!-- <el-menu-item index="/share">
      <i class="iconfont icon-fenxiang"></i>
      <span slot="title">分享</span>
    </el-menu-item>

    <el-menu-item index="/honor">
      <i class="iconfont icon-rongyu"></i>
      <span slot="title">荣誉</span>
    </el-menu-item>

    <el-menu-item index="/earn">
      <i class="iconfont icon-leijishouyi"></i>
      <span slot="title">收益</span>
    </el-menu-item> -->

    <el-menu-item index="/guide">
      <i class="iconfont icon-bangzhu"></i>
      <span slot="title">使用说明</span>
    </el-menu-item>

    <el-menu-item index="/setting">
      <i class="iconfont icon-shezhi"></i>
      <span slot="title">设置</span>
    </el-menu-item>

    <!-- <el-menu-item index="/mm">
      <i class="iconfont icon-shezhi"></i>
      <span slot="title">MetaMask</span>
    </el-menu-item> -->

    <el-menu-item @click="logout">
      <i class="iconfont icon-tuichu"></i>
      <span slot="title">退出</span>
    </el-menu-item>

  </el-menu>
</template>

<script>
export default {
  methods: {
    // handleOpen (key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose (key, keyPath) {
    //   console.log(key, keyPath);
    // }
    logout(){
      this.$store.commit('users/logout');
      // console.log('logout');
    }
  }
}
</script>
<style scoped  lang="scss">
.el-menu-vertical {
  border-right: none;
  /deep/ .el-menu-item {
    font-size: 1rem;
  }
  /deep/ .el-menu-item i {
    margin-right: 15px;
    width: 24px;
    text-align: center;
    font-size: 1.8rem;
    vertical-align: middle;
  }
}
</style>