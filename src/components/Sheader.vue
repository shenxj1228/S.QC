<style scoped>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo {
    width: 100px;
    height: 30px;
    color: white;
    float: left;
    position: relative;
    left: 20px;
}
.layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.layout-footer-center {
    text-align: center;
}
</style>

<template>
  <Header>
    <Menu mode="horizontal" theme="dark" active-name="0">
      <h1 class="layout-logo">S.QC</h1>
      <div class="layout-nav">
       <Submenu name="3">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                统计分析
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
      </div>
    </Menu>
  </Header>
</template>

<script>
export default {
    name: 'Sheader',
    data: function() {
        return {}
    }
}
</script>
