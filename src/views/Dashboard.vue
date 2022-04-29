<template>
  <div class="dash">
    <maintop title="文章" />

    <el-row style="min-height: 100%">
      <el-col :span="5">&nbsp;</el-col>
      <el-col :span="14" class="header-out" style="">
        <!-- ################### layout start ###################  -->

        <el-row class="topbutton">
          <el-col :span="24">
            <el-button
              type="primary"
              icon="iconfont icon-line-quillpenyumaobi"
              round
              @click="$router.push('/write')"
            >
              &nbsp;新文章
            </el-button>
            <el-button type="" icon="iconfont icon-bangzhuzhongxin" round></el-button>
          </el-col>
        </el-row>

        <!-- ################### article list ################### -->
        <div
          class="infinite-list-wrapper"
          v-infinite-scroll="debounceLoad"
          infinite-scroll-disabled="disabled"
          style="overflow: auto"
        >
          <el-empty v-if="list.length === 0" description="空空如也，虚怀若谷"></el-empty>
          <div v-else v-for="(item, index) in list" :key="index" class="article">
            <el-row class="">
              <el-col :span="20">
                <router-link :to="{ path: 'write', query: { id: item._id } }">
                  <div class="title">{{ item.title }}</div>
                </router-link>
                <div class="summary">
                  <span class="de-tag">{{ item.updatedAt | formatTime }}</span>
                  <span class="de-tag" :class="item.pass ? 'active' : ''">
                    {{ item.pass ? '已发布' : '草稿' }}
                  </span>
                  <span class="de-tag" v-if="item.tag">{{ item.tag }}</span>
                  <el-tooltip v-if="item.nft" :content="item.nft">
                    <span class="de-tag" >已上链</span>
                  </el-tooltip>
                  <el-tooltip v-if="item.owner" :content="item.owner">
                    <span class="de-tag" >已获拥有权</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="4" class="buttons">
                <a v-if="item.nft" @click="opensea(item)">
                  <div class="opensea">
                    <div></div>
                  </div>
                </a>
                <a v-if="item.pass" @click="openDocument(item)">
                  <i class="el-icon-link edit link" aria-hidden="true"></i>
                </a>
                <router-link :to="{ path: 'write', query: { id: item._id } }">
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
      <el-col :span="5">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
import { mine } from '@/api/articles'
import maintop from './dashboard/maintop'
import debounce from '@/utils/debounce'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'dashboard',
  components: {
    maintop,
  },
  data() {
    return {
      list: [],
      loading: false,
      noMore: false,

      page: {
        pageSize: 10,
        currentPage: 1,
      },
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    },
    ...mapState({
      address: (state) => state.users.address,
      domain: (state) => state.users.domain,
    }),
  },
  created: function () {
    this.debounceLoad = debounce(() => this.load())
  },
  async mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      const res = await mine(this.page)
      if (res.data && res.data.code === 0) {
        if (res.data.data && res.data.data.list.length > 0) {
          // this.list = res.data.data.list
          this.list.splice(this.list.length, 0, ...res.data.data.list)
          this.page.currentPage++
        } else {
          this.noMore = true
        }
        this.loading = false
      }
    },
    opensea(item) {
      let url = process.env.VUE_APP_OPENSEA
      window.open(url + process.env.VUE_APP_CONTRACT + '/' + item.nft)
    },
    openDocument(item) {
      let url = process.env.VUE_APP_SITE
      console.log(url)
      if (this.domain) {
        url = url.replace('domain', this.domain)
      } else {
        url = url.replace('domain', this.address)
      }
      url = url + '/posts/' + item._id + '.html'
      window.open(url)
    },
  },
}
</script>
<style scoped lang="scss">
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
.infinite-list-wrapper > p {
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
    justify-content: flex-end;
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
    .link {
      padding: 11px 11px;
    }
    i:hover {
      background-color: #00000008;
    }
    .opensea {
      width: 50px;
      height: 50px;
      padding: 6px 6px;
      margin-right: 12px;
      border-radius: 50px;
      div {
        background: url(/img/opensea2.svg) no-repeat center center;
        width: 37px;
        height: 37px;
        background-size: cover;
        border-radius: 50px;
      }
    }
    .opensea:hover {
      background-color: #00000008;
      cursor: pointer;
      div {
        background: url(/img/opensea.svg) no-repeat center center;
        background-size: cover;
        border-radius: 50px;
      }
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
