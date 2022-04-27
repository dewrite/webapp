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
                  <div class="desc">DeWrite是匿名网络，不要求必须设置昵称，但设置昵称可以帮你更好的记住你的身份。
                  </div>
                  <el-input v-model="name" placeholder="昵称"></el-input>
                </div>

                <div class="item">
                  <div class="label">标题</div>
                  <div class="desc">节点标题显示在节点首页，是节点内容的主题。</div>
                  <el-input v-model="title" placeholder="博客主题"></el-input>
                </div>

                <div class="item">
                  <div class="label">介绍</div>
                  <div class="desc">节点标题显示在节点首页，是节点内容的主题。</div>
                  <el-input v-model="desc" placeholder="博客介绍" type="textarea" :rows="3"></el-input>
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
import debounce from '@/utils/debounce';
import cover from "./dashboard/cover";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "setting",
  components: {
    maintop,
    cover
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      address: state => state.users.address,
      network: state => state.users.network,
    }),
    title: {
      get () {
        return this.$store.state.users.title
      },
      set (value) {
        this.setTitle(value)
        this.debounceUpdate({ title: value })
      }
    },
    desc: {
      get () {
        return this.$store.state.users.desc
      },
      set (value) {
        this.setDesc(value)
        this.debounceUpdate({ desc: value })
      }
    },
    name: {
      get () {
        return this.$store.state.users.name
      },
      set (value) {
        console.log(value);
        this.setName(value)
        this.debounceUpdate({ name: value })
      }
    },
    avatar: {
      get () {
        return this.$store.state.users.avatar
      },
      set (value) {
        this.setAvatar(value)
        this.debounceUpdate({ avatar: value })
      }
    },
  },
  created: function () {
    this.debounceUpdate = debounce((data)=> this.update(data)  )
  },
  methods: {
    ...mapMutations({
      setName: "users/setName",
      setTitle: "users/setTitle",
      setDesc: "users/setDesc",
      setAvatar: "users/setAvatar",
    }),
    ...mapActions({
      update: 'users/update'
    }),
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
/deep/ .el-input__inner , .el-textarea__inner{
  font-size: 1.2rem;
}
/deep/ .el-textarea__inner{
  font-size: 1.2rem;
}

</style>