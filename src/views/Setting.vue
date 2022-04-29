<template>
  <div class="setting">
    <maintop title="设置" />
    <el-row style="min-height: 100%;">
      <el-col :span="5">
        &nbsp;
      </el-col>
      <el-col :span="14" class="header-out" style="">
        <el-row class="header">
          <el-col :span="24">

            <el-row class="header-inner">
              <el-col :span="24">
                <cover />
                <div class="item">
                  <div class="label">昵称</div>
                  <div class="desc">DeWrite.io 虽然是匿名网络，但设置昵称可以帮你更好的记住你的身份。
                  </div>
                  <el-input v-model="name" placeholder="昵称"></el-input>
                </div>

                <div class="item">
                  <div class="label">子域名</div>
                  <div class="desc">为自己的去中心化网站设置子域名，可以让你的网站更加独立。
                  </div>
                  <el-input v-model="domain" placeholder="子域名"></el-input>
                </div>

                <div class="item">
                  <div class="label">个人网站主题</div>
                  <div class="desc">个人网站主题会显示在你的网站首页。</div>
                  <el-input v-model="title" placeholder="个人网站主题"></el-input>
                </div>

                <div class="item">
                  <div class="label">个人网站介绍</div>
                  <div class="desc">个人网站介绍会显示在你的网站首页。</div>
                  <el-input v-model="desc" placeholder="个人网站介绍" type="textarea" :rows="3"></el-input>
                </div>

                <div class="item buttons">
                  <el-button @click="save()" :disabled="saveLock" type="primary" round>保存</el-button>

                </div>

              </el-col>
            </el-row>

          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5">
        &nbsp;
      </el-col>
    </el-row>
  </div>
</template>

<script>
import maintop from "./dashboard/maintop";
import cover from "./dashboard/cover";
import { init, update } from '@/api/site'

import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "setting",
  components: {
    maintop,
    cover
  },
  data () {
    return {
      saveLock: false,
    }
  },
  computed: {
    ...mapState({
      uid: state => state.users.id,
      address: state => state.users.address,
      network: state => state.users.network,
    }),
    title: {
      get () {
        return this.$store.state.users.title
      },
      set (value) {
        this.setTitle(value)
      }
    },
    desc: {
      get () {
        return this.$store.state.users.desc
      },
      set (value) {
        this.setDesc(value)
      }
    },
    name: {
      get () {
        return this.$store.state.users.name
      },
      set (value) {
        this.setName(value)
      }
    },
    avatar: {
      get () {
        return this.$store.state.users.avatar
      },
      set (value) {
        this.setAvatar(value)
      }
    },
    domain: {
      get () {
        return this.$store.state.users.domain
      },
      set (value) {
        this.setDomain(value)
      }
    },
  },
  // created: function () {
  //   this.debounceUpdate = debounce((data)=> this.update(data)  )
  // },
  methods: {
    ...mapMutations({
      setName: "users/setName",
      setTitle: "users/setTitle",
      setDesc: "users/setDesc",
      setAvatar: "users/setAvatar",
      setDomain: "users/setDomain",
    }),
    ...mapActions({
      update: 'users/update'
    }),
    async save () {
      this.saveLock = true

      const tid = this.$toast.info(
        "保存并更新...", {
        position: "bottom-right",
        icon: "fa fa-rocket",
        rtl: false
      })
      try {
        await this.update({
          name: this.name,
          title: this.title,
          desc: this.desc,
          domain: this.domain,
        })
        await init(this.uid)
        await update(this.uid)
      } catch (e) {
        console.log(e);
      } finally {
        this.$toast.dismiss(tid);
        this.saveLock = false
      }

    }
  }
}
</script>
<style scoped lang="scss">
.setting {
  background-color: #00000008;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.header-out {
  min-height: 100%;
  padding: 24px;
}
.header {
  background-color: #fff;
  min-height: 100%;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 60px;
}
.header-inner {
  border-radius: 24px;
}

.item {
  padding: 16px 0;
  .label {
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
  }
  .desc {
    font-size: 1.2rem;
    color: #ccc;
    margin-bottom: 10px;
  }
}

/deep/ .el-input__inner,
.el-textarea__inner {
  font-size: 1.2rem;
}
/deep/ .el-textarea__inner {
  font-size: 1.2rem;
}

.buttons {
  padding: 20px;
  text-align: center;
  /deep/ .el-button--primary {
    width: 80%;
  }
  /deep/ .el-button {
    font-size: 1.6rem;
    font-weight: bold;
    border-radius: 50px;
  }
  /deep/ .iconfont {
    font-size: 1.6rem;
  }
}
</style>