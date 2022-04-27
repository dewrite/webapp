<template>
  <div class="write">
    <div class="box">
      <span class="growspace">
        <el-input v-model="title" class="title" placeholder="请输入标题"></el-input>
      </span>
      <span class="fixedspace">
        <el-button type="primary" plain :disabled="saveLock" @click="save()">保存草稿</el-button>
        <el-button type="primary" :disabled="publishLock" @click="publish()">发布文章</el-button>
      </span>
    </div>
    
    <mavon-editor class="mavonEditor" v-model="content" :boxShadow="false" />
  </div>
</template>
<script>
import { article } from '@/api/site'
import { addModel, updateModel, fetchId } from '@/api/articles'
import BackgroundTaskComponent from './dashboard/BackgroundTaskComponent'
import { mapState } from "vuex";

export default {
  data () {
    return {
      content: '',
      title: '',
      id: '',
      saveLock: false,
      publishLock: false,
    }
  },
  // components: {
  //   BackgroundTaskComponent,
  // },
  computed: {
    ...mapState({
      uid: state => state.users.id,
    }),
  },
  async mounted () {
    const id = this.$route.query.id
    if (id) {
      const res = await fetchId(id)
      if (res.data && res.data.code === 0) {
        this.id = id
        this.title = res.data.data.title
        this.content = res.data.data.content
      }
    }
  },
  methods: {
    async save () {
      this.saveLock = true
      if (!this.title) {
        this.$toast.error('请输入标题');
        this.saveLock = false
        return
      }
      let res
      if (this.id) {
        res = await updateModel(this.id, {
          title: this.title,
          content: this.content,
        })
        await article(this.id)
      } else {
        res = await addModel({
          title: this.title,
          content: this.content,
        })
      }
      // console.log(res.data);
      if (res.data && res.data.code === 0) {
        this.$toast.success('保存成功');
        if (res.data.data) {
          this.id = res.data.data._id
        }
      }
      this.saveLock = false
    },
    close(){
      // console.log("close event");
      this.publishLock = false
    },
    async publish () {
      this.publishLock = true
      if (!this.uid || !this.id) {
        this.$toast.error('请先保存草稿在发布');
        this.publishLock = false
        return
      }
      if (this.id) {
        await updateModel(this.id, {
          title: this.title,
          content: this.content,
        })
      } 
      const component = {
        component: BackgroundTaskComponent,
        props: {
          aid: this.id,
          uid: this.uid
        },
        listeners: {
          close: this.close
        },
      };

      this.$toast.info(
        component, {
        position: "bottom-right",
        timeout: false,
        closeOnClick: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        icon: "fa fa-rocket",
        rtl: false
      })
    }
  }
}
</script>
<style scoped  lang="scss">
.write {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.mavonEditor {
  width: 100%;
  height: 100%;
  border: none;
}
.title /deep/ .el-input__inner {
  font-size: 2rem;
  color: #000;
  border: none;
  margin: 10px 0;
}
.box {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 16px;
  height: 95px;
  border-bottom: solid 2px #00000008;
  /deep/ .el-button {
    border: none;
  }
}
.growspace {
  flex-grow: 1;
}
.fixedspace {
  padding-left: 10px;
  margin: 10px 0;
}
</style>