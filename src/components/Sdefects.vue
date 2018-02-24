<style scoped>
.ivu-page {
    user-select: none;
}
</style>
<template>

<div ref="defectview" style="left: 40px;display: block;flex:1">
   <Form ref="formQuery" :model="formQuery" style="margin:40px;margin-right:180px;" inline :label-width="80">
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
   <Table :height="tableHeight"  :loading="loading" :data="tableData" :columns="columns" stripe></Table>
     <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="totNum" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="[10,20,50,100]" placement="top"></Page>
        </div>
    </div>
    </div>
</template>
<script>
import { EventBus } from '../event-bus'
import api from '../qc-api'

// Listen for the i-got-clicked event and its payload.

export default {
    name: 'Sdefects',
    created: function() {
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
                console.log(err)
            })
    },
    mounted: function() {
        EventBus.$on('change-project', ({ domainName, projectName }) => {
            this.domainName = domainName
            this.projectName = projectName
            this.fetchData()
        })
        this.tableHeight =
            this.$refs.defectview.offsetHeight - 210 || this.tableHeight
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
            queryStr: '',offset: 1,
            pageSize: 10,
            totNum: 1000,
            columns: [],
            lists: []
        }
    },
    methods: {
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
                    console.log('获取缺陷列表失败')
                })
        },
        remoteFilter(value, key, column) {
            fetchData()
        },
        buildTableColumns() {
            if (this.fields.length === 0) {
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
                            fieldObjs.some(function(v) {
                                if (v.key === currentValue) {
                                    title = v.label
                                    type = v.type
                                    listId = v.listId
                                    return true
                                }
                            })
                            return {
                                title: title,
                                key: currentValue,
                                type: type,
                                listId: listId
                            }
                        }
                    )
                })
                .catch(res => {
                    console.log('获取缺陷字段列表失败')
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
                        reject(err)
                    })
            })
        },
        filterList(id) {
            if (id != '') {
                let result = this.lists.filter(function(val) {
                    return val.id == id
                })
                return result[0].items
            } else {
                return []
            }
        },
        queryDefect(){
             Object.keys(this.formQuery).forEach((val,index)=>{
                 console.log(this.formQuery[val]);
             })
        }
    }
}
</script>
