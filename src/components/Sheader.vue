 <style scoped>

</style>
 
<template>
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
            <MenuGroup v-bind:title="domain.label" v-for="(domain,index) in domainList" :key="index">
                <MenuItem v-bind:name="domain.label+'@'+project" v-for="(project,index) in domain.projects" :key="index" >{{project}}</MenuItem>                
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
</template>

<script>
import { EventBus } from '../event-bus.js'
import { logout } from '../qc-api'
export default {
    name: 'Sheader',
    data() {
        return {
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
    props: ['domainList'],
    methods: {
        menuAction(name) {
            switch (name) {
                case '1':
                    break
                case '2':
                    this.$router.push({
                        path: `/defects/${encodeURIComponent(
                            this.domainName
                        )}@${encodeURIComponent(this.projectName)}`
                    })
                    break
                case '4':
                    if (this.domainName != '' && this.projectName != '') {
                        this.$router.push({
                            path: `/setting/${encodeURIComponent(
                                this.domainName
                            )}@${encodeURIComponent(this.projectName)}`
                        })
                    } else {
                        alert('请先选择项目')
                    }

                    break
                case '5':
                    logout()
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
