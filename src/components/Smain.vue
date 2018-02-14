<template>
  <Layout style="height:100%;" >
    <Sheader v-bind:domainList="domains"></Sheader>
    <Scontent></Scontent>
    <Sfooter></Sfooter>  
  </Layout>
</template>

<script>
import Sheader from './Sheader'
import Scontent from './Scontent'
import Sfooter from './Sfooter'
import api from '../qc-api'

export default {
    name: 'Smain',
    beforeCreate: function(params) {
        const vm = this
        api.isAuthenticated().then(
            res => {
                api.getDomains().then(
                    domainNames => {
                        domainNames.forEach(function(domainName, index){
                            api.getProjects(domainName).then(
                                projectNames => {                                 
                                    vm.domains.push({
                                        label: domainName,
                                        projects: projectNames
                                    })
                                },
                                () => {}
                            )
                        })
                    },
                    res => {}
                )
            },
            res => {
                console.log('跳转登录页面')
                vm.$router.push({ path: '/login' })
            }
        )
    },
    data() {
        return {
            domains: []
        }
    },
    components: {
        Sheader,
        Scontent,
        Sfooter
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
