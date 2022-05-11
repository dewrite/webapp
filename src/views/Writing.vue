<template>
  <div class="write">
    <div class="box">
      <span class="growspace">
        <el-input v-model="title" class="title" placeholder="请输入标题"></el-input>
      </span>
      <span class="fixedspace">
        <el-button type="primary" plain :disabled="saveLock" @click="save()">保存草稿</el-button>
        <el-button type="primary" :disabled="publishLock" @click="publish()">发布文章</el-button>
        <el-button type="primary" @click="dialogVisible = true">发行NFT</el-button>
      </span>
    </div>

    <mavon-editor
      class="mavonEditor"
      v-model="content"
      ref="md"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
      :boxShadow="false"
    />

    <el-dialog
      title="发行NFT上链"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <publish v-if='dialogVisible' :id="id" @close="dialogVisible = false" />
    </el-dialog>
  </div>
</template>
<script>
import { article } from '@/api/site'
import { addModel, updateModel, fetchId } from '@/api/articles'
import backgroundtask from './dashboard/backgroundTask'
import publish from './dashboard/publish'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      content: '',
      title: '',
      id: '', // 文章id
      article: {}, // 文章对象
      saveLock: false, // 按钮的状态锁
      publishLock: false, // 按钮的状态锁
      dialogVisible: false, // 发行NFT上链弹窗
    }
  },
  components: {
    publish,
  },
  computed: {
    ...mapState({
      uid: (state) => state.users.id,
    }),
  },
  async mounted() {
    const id = this.$route.query.id
    if (id) {
      const res = await fetchId(id)
      if (res.data && res.data.code === 0) {
        this.id = id
        this.title = res.data.data.title
        this.content = res.data.data.content
        this.article = res.data.data
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('强制关闭可能让NFT上链失败，并可能重复收费，建议耐心等待自动执行完成')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('image', $file)
      axios({
        url: process.env.VUE_APP_API + '/api/public/upload/s3',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((req) => {
        if (req.data && req.data.code === 0) {
          // 第二步.将图片插入到编辑器中.
          console.log('upload: ', req.data.data.url)
          this.$refs.md.$img2Url(pos, req.data.data.url)
        }
      })
    },
    $imgDel(pos) {
      console.log('remove: ', pos[0])
      axios({
        url: process.env.VUE_APP_API + '/api/public/s3',
        method: 'delete',
        params: { file: pos[0] },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    async save() {
      this.saveLock = true
      if (!this.title) {
        this.$toast.error('请输入标题')
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
        this.$toast.success('保存成功')
        if (res.data.data) {
          this.id = res.data.data._id
        }
      }
      this.saveLock = false
    },
    close() {
      // console.log("close event");
      this.publishLock = false
    },
    async publish() {
      this.publishLock = true
      if (!this.uid || !this.id) {
        this.$toast.error('请先保存草稿在发布')
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
        component: backgroundtask,
        props: {
          aid: this.id,
          uid: this.uid,
          ipfs: this.article.ipfs,
          nft: this.article.nft,
        },
        listeners: {
          close: this.close,
        },
      }

      this.$toast.info(component, {
        position: 'bottom-right',
        timeout: false,
        closeOnClick: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        icon: 'fa fa-rocket',
        rtl: false,
      })
    },
  },
}
</script>
<style scoped lang="scss">
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
  .title /deep/ .el-input__inner {
    font-size: 2rem;
    color: #000;
    border: none;
    margin: 10px 0;
  }
  .growspace {
    flex-grow: 1;
  }
  .fixedspace {
    padding-left: 10px;
    margin: 10px 0;
  }
}

.el-dialog {
  border-radius: 20px;
}
</style>
