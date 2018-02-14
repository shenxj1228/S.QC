<style scoped>
.ivu-page {
    user-select: none;
}
</style>
<template>

<div style="left:40px;display: block;">
<h1 style="position:absolute;top:100px;left:40px;">{{projectName}}</h1>  
     <Table   :loading="loading" :data="tableData" :columns="columns" stripe></Table>
     <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage" ></Page>
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
        this.buildTableColumns()
        this.fetchData()
    },
    mounted: function() {
        EventBus.$on('change-project', ({ domainName, projectName }) => {
            this.domainName = domainName
            this.projectName = projectName
            this.fetchData()
        })
    },
    beforeDestory: function(params) {
        EventBus.$off('change-project')
    },
    watch: { $route: 'fetchData' },
    data() {
        return {
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
            columns: [
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row
                        const color =
                            row.status === 1
                                ? 'blue'
                                : row.status === 2 ? 'green' : 'red'
                        const text =
                            row.status === 1
                                ? 'Working'
                                : row.status === 2 ? 'Success' : 'Fail'

                        return h(
                            'Tag',
                            {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            },
                            text
                        )
                    }
                }
            ],
            tableColumns1: [
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row
                        const color =
                            row.status === 1
                                ? 'blue'
                                : row.status === 2 ? 'green' : 'red'
                        const text =
                            row.status === 1
                                ? 'Working'
                                : row.status === 2 ? 'Success' : 'Fail'

                        return h(
                            'Tag',
                            {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            },
                            text
                        )
                    }
                },
                {
                    title: 'Portrayal',
                    key: 'portrayal',
                    render: (h, params) => {
                        return h(
                            'Poptip',
                            {
                                props: {
                                    trigger: 'hover',
                                    title:
                                        params.row.portrayal.length +
                                        'portrayals',
                                    placement: 'bottom'
                                }
                            },
                            [
                                h('Tag', params.row.portrayal.length),
                                h(
                                    'div',
                                    {
                                        slot: 'content'
                                    },
                                    [
                                        h(
                                            'ul',
                                            this.tableData[
                                                params.index
                                            ].portrayal.map(item => {
                                                return h(
                                                    'li',
                                                    {
                                                        style: {
                                                            textAlign: 'center',
                                                            padding: '4px'
                                                        }
                                                    },
                                                    item
                                                )
                                            })
                                        )
                                    ]
                                )
                            ]
                        )
                    }
                },
                {
                    title: 'People',
                    key: 'people',
                    render: (h, params) => {
                        return h(
                            'Poptip',
                            {
                                props: {
                                    trigger: 'hover',
                                    title:
                                        params.row.people.length + 'customers',
                                    placement: 'bottom'
                                }
                            },
                            [
                                h('Tag', params.row.people.length),
                                h(
                                    'div',
                                    {
                                        slot: 'content'
                                    },
                                    [
                                        h(
                                            'ul',
                                            this.tableData[
                                                params.index
                                            ].people.map(item => {
                                                return h(
                                                    'li',
                                                    {
                                                        style: {
                                                            textAlign: 'center',
                                                            padding: '4px'
                                                        }
                                                    },
                                                    item.n +
                                                        '：' +
                                                        item.c +
                                                        'People'
                                                )
                                            })
                                        )
                                    ]
                                )
                            ]
                        )
                    }
                },
                {
                    title: 'Sampling Time',
                    key: 'time',
                    render: (h, params) => {
                        return h('div', 'Almost' + params.row.time + 'days')
                    }
                },
                {
                    title: 'Updated Time',
                    key: 'update',
                    render: (h, params) => {
                        return h(
                            'div',
                            this.formatDate(this.tableData[params.index].update)
                        )
                    }
                }
            ]
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
        changePage() {
            // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            this.fetchData()
        },
        fetchData() {
            if (this.fields.length === 0) {
                return
            }
            this.loading = true
            api.getDefects(this.domainName, this.projectName, this.fields).then(
                data => {
                    this.loading = false
                    this.tableData = data.data
                },
                res => {
                    console.log(res)
                }
            )
        },
        buildTableColumns() {
            if (this.fields.length === 0) {
                return
            }
            api.getFields(this.domainName, this.projectName).then(
                fieldObjs => {
                    this.columns = this.fields.map(
                        (currentValue, index, array) => {
                            let title = currentValue
                            fieldObjs.some(function(v) {
                                if (v.key === currentValue) {
                                    title = v.label
                                    return true
                                }
                            })
                            return { title: title, key: currentValue }
                        }
                    )
                },
                res => {}
            )
        }
    }
}
</script>
