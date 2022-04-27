<template>
  <div class='dash'>
    <maintop title="文章" />

    <el-row style="min-height: 100%;">
      <el-col :span="5">
        &nbsp;
      </el-col>
      <el-col :span="14" class="header-out" style="">
        <!-- ################### layout start ###################  -->

        <el-row class="topbutton">
          <el-col :span="24">
            <el-button type="primary" icon="iconfont icon-line-quillpenyumaobi" round @click="$router.push('/write')">
              &nbsp;新文章</el-button>
            <el-button type="" icon="iconfont icon-bangzhuzhongxin" round></el-button>
          </el-col>
        </el-row>

        <!-- ################### article list ################### -->
        <div class="infinite-list-wrapper" v-infinite-scroll="debounceLoad" infinite-scroll-disabled="disabled"
          style="overflow:auto">
          <el-empty v-if="list.length === 0" description="空空如也，虚怀若谷"></el-empty>
          <div v-else v-for="(item, index) in list" :key="index" class="article">

            <el-row class="">
              <el-col :span="20">
                <router-link :to="{ path: 'write', query: { id : item._id }}">
                  <div class="title">{{ item.title }}</div>
                </router-link>
                <div class="summary">
                  <span class="de-tag">{{ item.updatedAt | formatTime }}</span>
                  <span class="de-tag" :class="item.pass?'active':''">{{ item.pass ? "已发布":"草稿" }}</span>
                  <span class="de-tag" v-if="item.tag">{{ item.tag }}</span>
                </div>
              </el-col>
              <el-col :span="4" class="buttons">
                <router-link :to="{ path: 'write', query: { id : item._id }}" class="">
                  <i class="fa fa-chevron-right edit" aria-hidden="true"></i>
                </router-link>
              </el-col>
            </el-row>

          </div>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>

        <!-- ################### layout end ################### -->
      </el-col>
      <el-col :span="5">
        &nbsp;
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mine } from '@/api/articles'
import maintop from "./dashboard/maintop";
import debounce from '@/utils/debounce';

export default {
  name: "dashboard",
  components: {
    maintop
  },
  data () {
    return {
      list: [],
      loading: false,
      noMore: false,

      page: {
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  created: function () {
    this.debounceLoad = debounce(() => this.load())
  },
  async mounted () {
    this.load()
  },
  methods: {
    async load () {
      this.loading = true
      const res = await mine(this.page)
      if (res.data && res.data.code === 0) {
        if (res.data.data && res.data.data.list.length > 0) {
          // this.list = res.data.data.list
          this.list.splice(this.list.length,0,...res.data.data.list)
          this.page.currentPage++
        } else {
          this.noMore = true
        }
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang=scss>
.dash {
  background-color: #00000008;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.header-out {
  min-height: 100%;
  padding: 24px;
}

.topbutton {
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
.infinite-list-wrapper > p{
  text-align: center;
}
.article {
  background-color: #fff;
  min-height: 100%;
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 20px;
  border: 4px solid #fff;
  .title {
    font-size: 1.6rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 12px;
  }
  .buttons {
    display: flex;
    justify-content: end;
    align-items: center;
    height: 75px;
    .edit {
      color: #00000066;
      font-size: 1.8rem;
      margin-right: 12px;
      cursor: pointer;
      padding: 11px 15px;
      border-radius: 100px;
    }
    i:hover {
      background-color: #00000008;
    }
  }
}
div.article:hover {
  border: 4px solid #00000018;
}
.el-empty /deep/ .el-empty__description p {
  font-size: 2.4rem;
}
</style>