 <style scoped>
.layout-logo {
  width: 100px;
  height: 30px;
  color: white;
  float: left;
  position: relative;
  left: 20px;
  user-select: none;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
 
<template>
  <Header>
    <Menu mode="horizontal" theme="dark" active-name="0">
      <h1 class="layout-logo">S.QC</h1>
      <div class="layout-nav">
<MenuItem name="1">
<Icon type="android-refresh"></Icon>
刷  新
</MenuItem>
       <Submenu name="2">
            <template slot="title">
<Icon type="ios-shuffle-strong"></Icon>
                切换项目
            </template>
            <MenuGroup title="使用">
                <MenuItem name="3-1">新增和启动</MenuItem>
                <MenuItem name="3-2">活跃分析</MenuItem>
                <MenuItem name="3-3">时段分析</MenuItem>
            </MenuGroup>
            <MenuGroup title="留存">
                <MenuItem name="3-4">用户留存</MenuItem>
                <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
        </Submenu>
<MenuItem name="3">
<Icon type="android-settings"></Icon>
设  置
</MenuItem>

      </div>
    </Menu>
  </Header>
</template>

<script>
export default {
  name: "Sheader",
  created: function() {
    this.$axios
      .get("http://192.168.42.50:8088/qcbin/authentication-point/authenticate")
 .then(response => {console.log(response);}, response => {console.log(response);});

  },
  data: function() {
    return {};
  }
};
</script>
