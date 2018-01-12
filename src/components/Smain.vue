<template>
  <Layout >
    <Sheader></Sheader>
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
    created: function(params) {
        this.$http.get('/qcbin/rest/is-authenticated').then(
            response => {
                console.log('已经登录')
            },
            response => {
                console.log('跳转登录页面')
                this.$router.push({path:'/login'})
            }
        )
    },
    data() {
        return {}
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
