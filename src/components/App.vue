<style scoped>
.layout { border: 1px solid #d7dde4; background: #f5f7f9; position: relative; border-radius: 4px; overflow: hidden;}


</style>
<template>
    <div id="app" class="layout">
        <Layout>
           <Sheader></Sheader>
           <Scontent></Scontent>
          <Sfooter></Sfooter>  
        </Layout>
    </div>
</template>

<script>
import Sheader from './Sheader'
import Scontent from './Scontent'
import Sfooter from './Sfooter'

export default {
    name: 'app',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    components: {
        Sheader,
        Scontent,
        Sfooter
    }
}
</script>

<style>

</style>
