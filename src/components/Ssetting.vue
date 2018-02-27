<style scoped>
.ivu-transfer {
    margin: 0 auto;
}
</style>
<template>
<div style="height:100%; text-align:center">
     
 <Transfer style="display: inline-block;margin-top:8%;text-align:left"
        :titles="listTitle"
        :data="fields"
        :target-keys="targetKeys"
        :list-style="listStyle"
        :render-format="renderItem"
        :operations="['隐 藏','显 示']"
        @on-change="handleChange">
    </Transfer>
   
    </div>
   
</template>
<script>
import EventBus from '../event-bus.js'
import api from '../qc-api'
export default {
    data() {
        return {
            listTitle: ['隐藏字段', '显示字段'],
            domainName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : decodeURIComponent(this.$route.params.dp.split('@')[0]),
            projectName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : decodeURIComponent(this.$route.params.dp.split('@')[1]),
            fields: [],
            targetKeys: this.getTargetKeys(),
            listStyle: {
                width: '400px',
                height: '500px'
            },
            pageSize: 20
        }
    },
    created: function() {
        this.emptyProjectWarn()
        this.getFields()
        this.targetKeys = this.getTargetKeys()
        this.pageSize =
            parseInt(
                localStorage.getItem(
                    `${this.domainName}@${this.projectName}-pagesize`
                )
            ) || 20
    },
    mounted: function() {
        EventBus.$on('change-project', ({ domainName, projectName }) => {
            this.domainName = domainName
            this.projectName = projectName
            this.targetKeys = this.getTargetKeys()
            this.getFields()
        })
    },
    beforeDestory: function(params) {
        EventBus.$off('change-project')
    },
    methods: {
        emptyProjectWarn() {
            if (this.domainName == '' || this.projectName == '') {
                this.$Notice.error({
                    title: '错误信息',
                    desc: '请先选择一个项目'
                })
                return false
            }
        },
        getFields() {
            api
                .getFields(this.domainName, this.projectName)
                .then(data => {
                    this.fields = data
                })
                .catch(err => {
                    this.$Notice.error({
                        title:'错误信息',
                        desc:'获取项目字段信息出错，请刷新再试！'
                    })
                })
        },
        getTargetKeys() {
            let strogeField = localStorage.getItem(
                `${this.domainName}@${this.projectName}-fileds`
            )
            if (strogeField && strogeField.replace(' ', '') != '') {
                return JSON.parse(strogeField)
            }
            return []
        },
        handleChange(newTargetKeys) {
            localStorage.setItem(
                `${this.domainName}@${this.projectName}-fileds`,
                JSON.stringify(newTargetKeys)
            )
            this.targetKeys = newTargetKeys === '' ? [] : newTargetKeys
        },

        renderItem(item) {
            return item.label
        }
    }
}
</script>
