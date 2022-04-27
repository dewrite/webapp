<template>
  <div id="app">
    <div v-if="admin">
      <el-row class="dashboard">
        <el-col :span="4" class="sidepanel">
          <sidetop />
          <sidebar />
        </el-col>
        <el-col :span="20" class="mainpanel">
          <fade-transition origin="center" mode="out-in" :duration="400">
            <router-view />
          </fade-transition>
        </el-col>
      </el-row>
    </div>

    <div v-else>
      <router-view name="header"></router-view>
      <main>
        <fade-transition origin="center" mode="out-in" :duration="400">
          <router-view />
        </fade-transition>
      </main>
      <router-view name="footer"></router-view>
    </div>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import sidebar from "./views/dashboard/sidebar";
import sidetop from "./views/dashboard/sidetop";

export default {
  name: "App",
  components: {
    FadeTransition,
    sidebar,
    sidetop,
  },
  computed: {
    admin() {
      return this.$route.matched.some(record => record.meta.admin);
    }
  }
};
</script>
<style lang=scss>
@import "./element-variables.scss";
.dashboard {
  padding: 0px !important;
  margin: 0px !important;
  min-height: 100vh;
  height: 100vh;
}

.sidepanel{
  border-right: solid 2px #00000008;
  min-height: 100%;
  height: 100vh;
  overflow-x: auto;
}

.mainpanel{
  min-height: 100vh;
  height: 100vh;
}

.de-tag{
  text-align: center;
  border-radius: 15px;
  width: 100px;
  padding: 3px 10px;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 10px;
  color: #00000066;
  background-color: #00000008;
}
</style>
