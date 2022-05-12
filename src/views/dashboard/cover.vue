<template>
  <div class="cover" v-loading="loading" :style="{ backgroundImage: 'url(' + cover + ')' }">
    <el-tooltip placement="top">
      <div slot="content">上传封面图片</div>
      <el-upload
        :action="uploadapi"
        class="cover-uploader"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="coverSuccess"
        :headers="headers"
      >
        <el-button type="info" icon="el-icon-upload" circle></el-button>
      </el-upload>
    </el-tooltip>

    <div class="userinfo">
      <el-badge>
        <el-avatar :size="70" :src="avatar" :fit="fit"></el-avatar>
        <el-tooltip placement="top">
          <div slot="content">上传头像</div>
          <el-upload
            :action="uploadapi"
            class="avatar-uploader"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :on-success="avatarSuccess"
            :headers="headers"
          >
            <el-button type="info" icon="el-icon-upload" circle></el-button>
          </el-upload>
        </el-tooltip>
      </el-badge>

      <div class="name">{{ name }}</div>
      <div class="address de-tag">{{ address | shortAddress6 }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'cover',
  data() {
    return {
      uploadapi: process.env.VUE_APP_API + '/api/public/upload/s3',
      fit: 'cover',
      loading: false,
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.users.address,
      name: (state) => state.users.name,
      avatar: (state) => state.users.avatar,
      cover: (state) => state.users.cover,
      token: (state) => state.users.token,
    }),
    headers() {
      return {
        Authorization: 'Bearer ' + this.token,
      }
    },
  },
  methods: {
    ...mapMutations({
      setAvatar: 'users/setAvatar',
      setCover: 'users/setCover',
    }),
    ...mapActions({
      update: 'users/update',
    }),
    beforeUpload() {
      this.loading = true
    },
    avatarSuccess(res, file) {
      if (res.code === 0) {
        this.setAvatar(res.data.url)
        this.update({ avatar: res.data.url })
      }
      this.loading = false
    },
    coverSuccess(res, file) {
      if (res.code === 0) {
        this.setCover(res.data.url)
        this.update({ cover: res.data.url })
      }
      this.loading = false
    },
  },
}
</script>

<style scoped lang="scss">
.cover {
  /* background: url('http://127.0.0.1:9000/20220424/6da7838865ce1904ccb4abfa1ec226cb.jpeg'); */
  background-size: cover;
  background-position: center;

  width: 100%;
  height: 340px;
  background-color: #00000008;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding-top: 200px;
  .userinfo {
    text-align: center;
    background-color: #fff;
    height: 140px;
    border: 2px solid #00000008;
    /deep/ .el-badge {
      top: -35px;
    }
    .name {
      font-size: 24px;
      top: -30px;
      position: relative;
    }
    .address {
      top: -20px;
      position: relative;
      width: 10rem;
      margin: auto;
    }
  }
  .avatar-uploader {
    position: absolute;
    top: 50px;
    left: 50px;
  }

  .cover-uploader {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  /deep/ .el-button.is-circle {
    padding: 5px;
  }
  .el-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
