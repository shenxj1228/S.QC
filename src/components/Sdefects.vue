<style scoped>
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #f5f5f5;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background-color: #f5f5f5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
    background-color: #5cadff;
}

.ivu-page {
    user-select: none;
}
.slider-left {
    background-color: #bbbec4;
    padding-bottom: 40px;
}
.ivu-layout-sider-collapsed .ivu-form.ivu-form-label-right {
    width: 0px !important;
    transition: width 0.2s ease;
}
.ivu-layout-sider-collapsed .ivu-form.ivu-form-label-right {
    overflow: hidden;
}
.ivu-form.ivu-form-label-right {
    overflow-y: auto;
    height: 100%;
    padding-top: 20px;
}
.ivu-table-body {
    overflow-x: hidden;
    overflow-y: auto;
}
.ivu-table-wrapper {
    transition: width 0.8s, height 0.8s;
    -moz-transition: 0.8s, height 0.8s; /* Firefox 4 */
    -webkit-transition: 0.8s, height 0.8s; /* Safari 和 Chrome */
    -o-transition: 0.8s, height 0.8s; /* Opera */
}
</style>
<template>
    <Layout ref="layout">
        <Sider ref="sider" width="320" class="slider-left" style="" collapsible @on-collapse="onCollapse">
            <Form ref="formQuery" :model="formQuery" style="" :label-width="100" label-position="right">
                <FormItem :prop="condition.key" :label="condition.title" v-for="(condition,index) in queryCondition" :key="index">
                    <Select v-if="condition.listId!=''&&condition.type.indexOf('List')>-1" v-model="formQuery[condition.key]" :style="{width:condition.width+'px'}" clearable>
                        <Option v-if="condition.listId!=''&&condition.type.indexOf('List')>-1" v-for="item in filterList(condition.listId)" :value="item" :key="item">{{ item }}
                        </Option>
                    </Select>
                    <DatePicker :transfer="(1===1)" v-else-if="condition.type.indexOf('Date')>-1" confirm v-model="formQuery[condition.key]" type="daterange" placement="right-start" placeholder="选择日期" format="yyyy-MM-dd" :style="{width:condition.width+'px'}"></DatePicker>
                    <Input v-else type="text" v-model="formQuery[condition.key]" :style="{width:condition.width+'px'}" clearable>
                    </Input>
                </FormItem>
                <FormItem style="display:block;">
                    <Button type="primary" @click="queryDefect">查 询</Button>
                </FormItem>
            </Form>
        </Sider>
        <Layout ref="tableOut">
            <Content>
                <Table :height="table.height" :width="table.width" :loading="loading" :data="tableData" :columns="columns" stripe></Table>
            </Content>
            <Footer ref="page">
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="totNum" show-total :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="[10,20,50,100]" placement="top" style="height:10%"></Page>
                    </div>
                </div>
            </Footer>

        </Layout>
       
    </Layout>
</template>
<script>
import EventBus from '../event-bus'
import api from '../qc-api'

// Listen for the i-got-clicked event and its payload.

export default {
    name: 'Sdefects',
    created: function() {
        this.emptyProjectWarn()
        this.resultFields =
            localStorage.getItem(
                `${this.domainName}@${this.projectName}-resultFields`
            ) === null
                ? []
                : JSON.parse(
                      localStorage.getItem(
                          `${this.domainName}@${this.projectName}-resultFields`
                      )
                  )
        this.searchFields =
            localStorage.getItem(
                `${this.domainName}@${this.projectName}-searchFields`
            ) === null
                ? []
                : JSON.parse(
                      localStorage.getItem(
                          `${this.domainName}@${this.projectName}-searchFields`
                      )
                  )
        this.getLists()
            .then(lists => {
                this.lists = lists
                this.buildTableColumns()
                this.fetchData()
            })
            .catch(err => {
                if (err.response.status === '401') {
                    this.$router.push('/login')
                    retrun
                }
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
        EventBus.$on('fullscreen', isFullScreen => {
            this.renderTable()
        })

        this.renderTable()
        //  this.$refs.layout.$el.offsetWidth - this.$refs.sider.$el.offsetWidth
    },
    beforeDestory: function(params) {
        EventBus.$off('change-project')
        EventBus.$off('fullscreen')
    },
    watch: { $route: 'fetchData' },
    data() {
        return {
            formQuery: {},
            queryCondition: {},
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
            lists: [],
            table: { height: '', width: '' }
        }
    },
    methods: {
        renderTable() {
            setTimeout(() => {
                this.table.height =
                    this.$refs.layout.$el.offsetHeight -
                    this.$refs.page.$el.offsetHeight
                this.table.width =
                    this.$refs.layout.$el.offsetWidth -
                    this.$refs.sider.$el.offsetWidth
            }, 400)
        },
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
            if (this.resultFields.length === 0) {
                return
            }
            this.loading = true
            api
                .getDefects(
                    this.domainName,
                    this.projectName,
                    this.resultFields,
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
                .catch(err => {
                    if (err.response.status === '401') {
                        this.$router.push('/login')
                        retrun
                    }
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
            if (this.resultFields.length === 0) {
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
                    this.columns = this.resultFields.map(
                        (currentValue, index, array) => {
                            let title = currentValue
                            let type = ''
                            let width = 100
                            fieldObjs.some(function(v) {
                                if (v.key === currentValue) {
                                    title = v.label
                                    type = v.type
                                    switch (v.type) {
                                        case 'Number':
                                            width = 60
                                            break
                                        case 'Date':
                                            width = 100
                                            break
                                        case 'DateTime':
                                            width = 200
                                            break
                                        case 'UsersList':
                                            width = 100
                                            break
                                        case 'LookupList':
                                            width = 100
                                            break
                                        case 'Reference':
                                            width = 200
                                            break
                                        default:
                                            width = 220
                                    }
                                    if (v.key === 'name') {
                                        width = 600
                                    }
                                    return true
                                }
                            })

                            return {
                                title: title,
                                key: currentValue,
                                type: type,
                                width: width
                            }
                        }
                    )
                    this.queryCondition = this.searchFields.map(
                        (currentValue, index, array) => {
                            let title = currentValue
                            let type = ''
                            let listId = ''
                            let width = 500
                            fieldObjs.some(function(v) {
                                if (v.key === currentValue) {
                                    title = v.label
                                    type = v.type
                                    listId = v.listId
                                    switch (v.type) {
                                        case 'Number':
                                            width = 80
                                            break
                                        case 'Date':
                                            width = 200
                                            break
                                        case 'DateTime':
                                            width = 200
                                            break
                                        case 'UsersList':
                                            width = 200
                                            break
                                        case 'LookupList':
                                            width = 200
                                            break
                                        case 'Reference':
                                            width = 200
                                            break
                                        default:
                                            width = 220
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
                    if (res.response.status === '401') {
                        this.$router.push('/login')
                        retrun
                    }
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
            let queryStr = ''
            Object.keys(this.formQuery).forEach((val, index) => {
                if (Array.isArray(this.formQuery[val])) {
                    if (
                        this.formQuery[val][0] != '' &&
                        this.formQuery[val][0] != null &&
                        this.formQuery[val][1] != '' &&
                        this.formQuery[val][1] != null
                    ) {
                        let startDate = this.formQuery[val][0]
                            .toLocaleDateString()
                            .replace(/\//g, '-')
                        let endDate = this.formQuery[val][1]
                            .toLocaleDateString()
                            .replace(/\//g, '-')
                        queryStr =
                            queryStr +
                            `${val}[>='${startDate}' And <='${endDate}'];`
                    }
                } else {
                    if (this.formQuery[val].trim() != '')
                        queryStr = queryStr + `${val}[${this.formQuery[val]}];`
                }
            })
            if (queryStr.endsWith(';')) {
                queryStr = queryStr.substring(0, queryStr.length - 1)
            }
            this.queryStr = queryStr
            this.fetchData()
        },
        onCollapse() {
            this.renderTable()
        },
        timeChange(val) {
            console.log(val)
        }
    }
}
</script>
