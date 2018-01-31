 <style scoped>
.layout-logo {
  width: 500px;
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
    <Menu mode="horizontal" theme="dark" active-name="0" @on-select="menuAction">
      <h1 class="layout-logo"> {{projectName}}</h1>
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
            <MenuGroup v-bind:title="domain.label" v-for="(domain,index) in domainList" :key="index">
                <MenuItem v-bind:name="'domains/'+domain.label+'/projects/'+project.label" v-for="(project,index) in domain.projects" :key="index" >{{project.label}}</MenuItem>                
            </MenuGroup>
            
        </Submenu>
<MenuItem name="3">
<Icon type="android-settings"></Icon>
设  置
</MenuItem>
<MenuItem name="4" >
<Icon type="log-out"></Icon>
注  销
</MenuItem>
      </div>
    </Menu>
  </Header>
</template>

<script>
import { EventBus } from '../event-bus.js'
export default {
  name: 'Sheader',
  data() {
    return { projectName: 'S.QC', domainName: '' }
  },
  props: ['domainList'],
  methods: {
    menuAction(name) {
      switch (name) {
        case '1':
          break
        case '2':
          break
        case '3':
          this.$router.push({ path: '/setting' })
          break
        case '4':
          const vm = this
          vm.$http
            .get('/qcbin/authentication-point/logout')
            .then(
              res => {
                vm.$router.push({ path: '/login' })
              },
              res => {
                console.log(res)
              }
            )
            .catch(err => {
              console.log(err)
            })
          break

        default:
          let names = name.split('/')
          this.$router.push({
            path: '/defects/' + names[1] + '@' + names.pop()
          })
          EventBus.$emit('show-defects', name)

          this.projectName = names.pop()
          this.domainName = names[1]
          break
      }
    }
  }
}
</script>
