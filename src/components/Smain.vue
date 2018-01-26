<template>
  <Layout  >
    <Sheader v-bind:domainList="domains"></Sheader>
    <Scontent></Scontent>
    <Sfooter></Sfooter>  
  </Layout>
</template>

<script>
import Sheader from './Sheader'
import Scontent from './Scontent'
import Sfooter from './Sfooter'

export default {
  name: 'Smain',
  beforeCreate: function(params) {
    const vm = this
    vm.domains = []
    vm.$http.get('/qcbin/rest/is-authenticated').then(
      response => {
        vm.$http.get('/qcbin/rest/domains').then(
          res => {
            vm
              .jquery(res.data)
              .find('Domain')
              .each(function() {
                let dname = vm.jquery(this).attr('Name')

                vm.$http.get('/qcbin/rest/domains/' + dname + '/projects').then(
                  res => {
                    let projects = []
                    vm
                      .jquery(res.data)
                      .find('Project')
                      .each(function() {
                        projects.push({ label: vm.jquery(this).attr('Name') })
                      })
                    vm.domains.push({ label: dname, projects: projects })
                  },
                  res => {}
                )
              })
          },
          res => {}
        )
      },
      response => {
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
