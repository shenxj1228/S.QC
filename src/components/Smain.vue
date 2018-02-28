<template>
<div class="layout" style="height:100%;" >
  <Layout  style="height:100%;" >
    <Header>
          <Menu mode="horizontal" theme="dark" active-name="0" @on-select="menuAction">
      <h1 class="layout-logo">  <router-link style=" color: white;" :to="{ path: '/index'}">S.QC</router-link><span style="font-size:18px" v-if="projectName!=''"> —— {{projectName}}</span></h1>
      <div class="layout-nav">
<MenuItem name="1">
<Icon type="android-refresh"></Icon>
刷  新
</MenuItem>
<MenuItem name="2">
<Icon type="bug"></Icon>
缺 陷
</MenuItem>
       <Submenu name="3">
            <template slot="title">
<Icon type="ios-shuffle-strong"></Icon>
                切换项目
            </template>
            <MenuGroup :title="domain.label" v-for="(domain,index) in domainList" :key="index">
                <MenuItem :name="domain.label+'@'+project" v-for="(project,index) in domain.projects" :key="index" >{{project}}</MenuItem>                
            </MenuGroup>
            
        </Submenu>
<MenuItem name="4">
<Icon type="android-settings"></Icon>
设  置
</MenuItem>
<MenuItem name="5" >
<Icon type="log-out"></Icon>
注  销
</MenuItem>
      </div>
    </Menu>
    </Header>
    
    <Content style="display:flex;flex-direction:column" ><router-view/></Content>
  
  </Layout>
  </div>
</template>

<script>
import api from '../qc-api'
import EventBus from '../event-bus'
export default {
    name: 'Smain',
    beforeCreate: function(params) {
        const vm = this
        api
            .isAuthenticated()
            .then(res => {
                api
                    .getDomains()
                    .then(domainNames => {
                        domainNames.forEach(function(domainName, index) {
                            api
                                .getProjects(domainName)
                                .then(projectNames => {
                                    vm.domainList.push({
                                        label: domainName,
                                        projects: projectNames
                                    })
                                })
                                .catch(err => {
                                    console.log('获取项目列表失败')
                                })
                        })
                    })
                    .catch(err => {
                        console.log('获取域列表失败')
                    })
            })
            .catch(res => {
                console.log('跳转登录页面')
                vm.$router.push({ path: '/login' })
            })
    },
    mounted: function() {},
    data() {
        return {
            domainList: [],
            projectName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : this.$route.params.dp.split('@')[1],
            domainName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : this.$route.params.dp.split('@')[0]
        }
    },
    methods: {
        go2Page(path, content) {
            if (this.domainName != '' && this.projectName != '') {
                this.$router.push({
                    path: `${path}/${encodeURIComponent(
                        this.domainName
                    )}@${encodeURIComponent(this.projectName)}`
                })
            } else {
                this.$Notice.warning({
                    title: '注意',
                    desc:content
                })
            }
        },
        menuAction(name) {
            switch (name) {
                case '1':
                    break
                case '2':                   
                    this.go2Page('/defects','请在切换项目菜单中先选择一个项目')
                    break
                case '4':                   
                    this.go2Page('/setting','请在切换项目菜单中先选择一个项目')
                    break
                case '5':
                    api
                        .logout()
                        .then(res => {
                            this.$router.push({ path: '/login' })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    break

                default:
                    let names = name.split('@')
                    this.projectName = names[1]
                    this.domainName = names[0]
                    EventBus.$emit('change-project', {
                        projectName: this.projectName,
                        domainName: this.domainName
                    })
                    break
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout-logo {
    height: 30px;
    color: white;
    float: left;
    position: relative;
    user-select: none;
}

.layout-nav {
    width: 520px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
