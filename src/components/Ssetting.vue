<style scoped>
.ivu-transfer {
    margin: 0 auto;
}
</style>
<template>
<div style="height:100%; display:flex;align-items: center;">
  <div style="position:absolute;left:60px;top:100px">
    <h1>{{projectName}}</h1>
    <section style="font-size:16px;text-indent:2em;">缺陷列表显示字段设置，默认显示顺序是显示字段列表中从下往上。</section>
  </div>

 <Transfer
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
export default {
    data() {
        return {
            listTitle: ['隐藏字段', '显示字段'],
            projectName: this.$route.params.dp.split('@')[1],
            domainName: this.$route.params.dp.split('@')[0],
            fields: [],
            targetKeys: this.getTargetKeys(),
            listStyle: {
                width: '400px',
                height: '500px'
            }
        }
    },
    beforeCreate: function() {
        return this.$http
            .get(
                `/qcbin/rest/domains/${
                    this.$route.params.dp.split('@')[0]
                }/projects/${
                    this.$route.params.dp.split('@')[1]
                }/customization/entities/defect/fields`
            )
            .then(
                res => {
                    let fieldArray = []
                    let vm = this
                    vm
                        .jquery(res.data)
                        .find('Field')
                        .each(function() {
                            let vtmp = vm.jquery(this)
                            if (vtmp.find('Active').text() === 'true') {
                                let tmpObj = {
                                    key: vtmp.attr('Name'),
                                    label: vtmp.attr('Label'),
                                    required: vtmp.find('Required').text(),
                                    system: vtmp.find('System').text(),
                                    type: vtmp.find('Type').text(),
                                    active: vtmp.find('Active').text(),
                                    editable: vtmp.find('Editable').text(),
                                    verify: vtmp.find('Verify').text()
                                }
                                fieldArray.push(tmpObj)
                            }
                        })
                    this.fields = fieldArray
                },
                res => {
                    vm.$router.push({ path: '/index' })
                }
            )
    },
    methods: {
        getTargetKeys() {
            let strogeField = localStorage.getItem(
                `${this.$route.params.dp}-fileds`
            )
            if (strogeField && strogeField.replace(' ', '') != '') {
                return JSON.parse(strogeField)
            }
            return []
        },
        handleChange(newTargetKeys) {
            localStorage.setItem(
                `${this.$route.params.dp}-fileds`,
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
