<style scoped>
.ivu-page {
    user-select: none;
}
.query-title {
    padding: 30px;
    padding-right: 180px;
    background-color: #bbbec4;
}
</style>
<template>

<div ref="defectview" style="left: 40px;display: block;flex:1">
   <Form ref="formQuery" :model="formQuery" class="query-title" inline :label-width="80" style="height:20%" >
        <FormItem :prop="column.key" :label="column.title" v-for="(column,index) in columns" :key="index">
        <Select  v-if="column.listId!=''&&column.type.indexOf('List')>-1"  v-model="formQuery[column.key]" style="width:140px">
            <Option v-if="column.listId!=''&&column.type.indexOf('List')>-1" v-for="item in filterList(column.listId)" :value="item" :key="item">{{ item }}
        </Option>
        </Select>
        <DatePicker v-else-if="column.type==='Date'" v-model="formQuery[column.key]" type="daterange" placement="bottom-start" placeholder="选择日期" format="yyyy年MM月dd日" style="width: 240px"></DatePicker>
        <TimePicker type="timerange" placement="bottom-start" v-model="formQuery[column.key]"  v-else-if="column.type==='DateTime'" format="HH时mm分" placeholder="选择时间" style="width: 112px"></TimePicker>
        <Input v-else type="text" v-model="formQuery[column.key]" style="width:300px;"  clearable>                
            </Input>
        </FormItem>       
        <FormItem style="display:block;">
            <Button type="primary" @click="queryDefect">查 询</Button>
        </FormItem>
    </Form> 
   <Table :height="tableHeight" theme="dark" :loading="loading" :data="tableData" :columns="columns" stripe></Table>
     <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="totNum" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="[10,20,50,100]" placement="top" style="height:10%"></Page>
        </div>
    </div>
    </div>
</template>
<script>
import EventBus from '../event-bus'
import api from '../qc-api'

// Listen for the i-got-clicked event and its payload.

export default {
    name: 'Sdefects',
    created: function() {
        this.emptyProjectWarn()
        this.fields =
            localStorage.getItem(
                `${this.domainName}@${this.projectName}-fileds`
            ) === null
                ? []
                : JSON.parse(
                      localStorage.getItem(
                          `${this.domainName}@${this.projectName}-fileds`
                      )
                  )
        this.getLists()
            .then(lists => {
                this.lists = lists
                this.buildTableColumns()
                this.fetchData()
            })
            .catch(err => {
                this.$Notice.error({
                    title: '错误信息',
                    desc: '获取数据字典列表出错，请刷新再试！',
                    duration: 0
                })
            })
    },
    mounted: function() {
        EventBus.$on('change-project', ({ domainName, projectName }) => {
            this.domainName = domainName
            this.projectName = projectName
            this.fetchData()
        })
        this.tableHeight =
            this.$refs.defectview.offsetHeight * 0.7 || this.tableHeight
    },
    beforeDestory: function(params) {
        EventBus.$off('change-project')
    },
    watch: { $route: 'fetchData' },
    data() {
        return {
            formQuery: {},
            tableHeight: 400,
            domainName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : decodeURIComponent(this.$route.params.dp.split('@')[0]),
            projectName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : decodeURIComponent(this.$route.params.dp.split('@')[1]),
            loading: true,
            tableData: [],
            fields: [],
            queryStr: '',
            offset: 1,
            pageSize: 10,
            totNum: 1000,
            columns: [],
            lists: []
        }
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
        formatDate(date) {
            const y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            let d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + m + '-' + d
        },
        changePage(val) {
            // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            this.offset = this.pageSize * (val - 1) + 1
            this.fetchData(true)
        },
        changePageSize(val) {
            this.pageSize = val
            this.offset = 1
            this.fetchData(true)
        },
        fetchData(isChangePage = false) {
            if (this.fields.length === 0) {
                return
            }
            this.loading = true
            api
                .getDefects(
                    this.domainName,
                    this.projectName,
                    this.fields,
                    this.queryStr,
                    this.offset,
                    this.pageSize
                )
                .then(data => {
                    this.loading = false
                    this.tableData = data.data
                    if (!isChangePage) {
                        this.totNum = parseInt(data.totNum, 10)
                    }
                })
                .catch(data => {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: '获取缺陷列表出错，请刷新再试！',
                        duration: 0
                    })
                })
        },
        remoteFilter(value, key, column) {
            fetchData()
        },
        buildTableColumns() {
            if (this.fields.length === 0) {
                this.$Modal.warning({
                    title: '显示字段警告',
                    content: '当前项目没有设置显示字段,将跳转到设置页面',
                    onOk: () => {
                        this.$router.push({
                            path: `/setting/${this.domainName}@${
                                this.projectName
                            }`
                        })
                    }
                })
                return
            }
            api
                .getFields(this.domainName, this.projectName)
                .then(fieldObjs => {
                    this.columns = this.fields.map(
                        (currentValue, index, array) => {
                            let title = currentValue
                            let type = ''
                            let listId = ''
                            let width = 0
                            fieldObjs.some(function(v) {
                                if (v.key === currentValue) {
                                    title = v.label
                                    type = v.type
                                    listId = v.listId
                                    switch (v.type) {
                                        case 'Number':
                                            width = 100
                                            break
                                        case 'Date':

                                        case 'DateTime':
                                            width = 200
                                            break
                                        case 'Reference':
                                            width = 300
                                            break
                                        default:
                                            width = 500
                                    }
                                    return true
                                }
                            })
                            return {
                                title: title,
                                key: currentValue,
                                type: type,
                                listId: listId,
                                width: width
                            }
                        }
                    )
                })
                .catch(res => {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: '获取缺陷字段列表出错，请刷新再试！',
                        duration: 0
                    })
                })
        },
        getLists() {
            return new Promise((resolve, reject) => {
                api
                    .getLists(this.domainName, this.projectName)
                    .then(lists => {
                        resolve(lists)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        filterList(id) {
            if (id != '') {
                let result = this.lists.filter(function(val) {
                    return val.id == id
                })
                if (result.length < 1) {
                    return []
                }
                return result[0].items
            } else {
                return []
            }
        },
        queryDefect() {
            Object.keys(this.formQuery).forEach((val, index) => {
                if (Array.isArray(this.formQuery[val])) {
                }
            })
        }
    }
}
</script>
