<style scoped>
.ivu-transfer {
  margin: 0 auto;
}
</style>
<template>
    <Tabs v-model="defaultTab" style="height:100%; text-align:center">

        <TabPane label="查询条件展示" name="0">

            <Transfer style="display: inline-block;margin-top:5%;text-align:left" :titles="listTitle" :data="fields" :target-keys="targetKeys1" :list-style="listStyle" :render-format="renderItem" :operations="['隐 藏','显 示']" @on-change="handleChange1">

            </Transfer>

        </TabPane>
        <TabPane label="查询结果展示" name="1">

            <Transfer style="display: inline-block;margin-top:5%;text-align:left" :titles="listTitle" :data="fields" :target-keys="targetKeys2" :list-style="listStyle" :render-format="renderItem" :operations="['隐 藏','显 示']" @on-change="handleChange2">

            </Transfer>


        </TabPane>

    </Tabs>

</template>
<script>
import EventBus from "../event-bus.js";
import api from "../qc-api";
export default {
  data() {
    return {
      defaultTab: "1",
      listTitle: ["隐藏字段", "显示字段"],
      domainName:
        typeof this.$route.params.dp === "undefined"
          ? ""
          : decodeURIComponent(this.$route.params.dp.split("@")[0]),
      projectName:
        typeof this.$route.params.dp === "undefined"
          ? ""
          : decodeURIComponent(this.$route.params.dp.split("@")[1]),
      fields: [],
      targetKeys2: this.gettargetKeys2(),
      targetKeys1: this.gettargetKeys1(),
      listStyle: {
        width: "400px",
        height: "500px"
      }
    };
  },
  created: function() {
    this.emptyProjectWarn();
    this.getFields();
    this.targetKeys2 = this.gettargetKeys2();
    this.targetKeys1 = this.gettargetKeys1();
  },
  mounted: function() {
    EventBus.$on("change-project", ({ domainName, projectName }) => {
      this.domainName = domainName;
      this.projectName = projectName;
      this.targetKeys2 = this.gettargetKeys2();
      this.targetKeys1 = this.gettargetKeys1();
      this.getFields();
    });
  },
  beforeDestory: function(params) {
    EventBus.$off("change-project");
  },
  methods: {
    emptyProjectWarn() {
      if (this.domainName == "" || this.projectName == "") {
        this.$Notice.error({
          title: "错误信息",
          desc: "请先选择一个项目"
        });
        return false;
      }
    },
    getFields() {
      api
        .getFields(this.domainName, this.projectName)
        .then(data => {
          this.fields = data;
        })
        .catch(err => {
          this.$Notice.error({
            title: "错误信息",
            desc: "获取项目字段信息出错，请刷新再试！"
          });
        });
    },
    gettargetKeys2() {
      let strogeField = localStorage.getItem(
        `${this.domainName}@${this.projectName}-resultFields`
      );
      if (strogeField && strogeField.replace(" ", "") != "") {
        return JSON.parse(strogeField);
      }
      return [];
    },
    handleChange2(newtargetKeys) {
      localStorage.setItem(
        `${this.domainName}@${this.projectName}-resultFields`,
        JSON.stringify(newtargetKeys)
      );
      this.targetKeys2 = newtargetKeys === "" ? [] : newtargetKeys;
    },
    gettargetKeys1() {
      let strogeField = localStorage.getItem(
        `${this.domainName}@${this.projectName}-searchFields`
      );
      if (strogeField && strogeField.replace(" ", "") != "") {
        return JSON.parse(strogeField);
      }
      return [];
    },
    handleChange1(newtargetKeys) {
      localStorage.setItem(
        `${this.domainName}@${this.projectName}-searchFields`,
        JSON.stringify(newtargetKeys)
      );
      this.targetKeys1 = newtargetKeys === "" ? [] : newtargetKeys;
    },
    renderItem(item) {
      return item.label;
    }
  }
};
</script>
