<template>
  <Layout style="height:100%;">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="0" @on-select="menuAction">
        <h1 class="layout-logo">
          <router-link style=" color: white;" :to="{ path: '/index'}">S.QC</router-link>
          <span style="font-size:18px" v-if="projectName!=''"> —— {{projectName}}</span>
        </h1>
        <div class="layout-nav">
          <MenuItem name="1">
          <Icon type="android-add"></Icon>
          新 增
          </MenuItem>
          <MenuItem name="2">
          <Icon type="bug"></Icon>
          缺 陷
          </MenuItem>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-shuffle-strong"></Icon>
              切换项目
            </template>
            <MenuGroup :title="domain.label" v-for="(domain,index) in domainList" :key="index">
              <MenuItem :name="domain.label+'@'+project" v-for="(project,index) in domain.projects" :key="index">{{project}}</MenuItem>
            </MenuGroup>

          </Submenu>
          <MenuItem name="4">
          <Icon type="android-settings"></Icon>
          设 置
          </MenuItem>
          <MenuItem name="5">
          <Icon type="log-out"></Icon>

          注 销
          </MenuItem>
          <MenuItem name="6">
          <Icon v-if="!isFullScreen" type="arrow-expand"></Icon>
          <Icon v-if="isFullScreen" type="arrow-shrink"></Icon>
          全屏
          </MenuItem>

        </div>
      </Menu>
    </Header>

    <Content style="display:flex;flex-direction:column">
      <router-view/>
    </Content>
    <Modal width="60" v-model="model.show" title="新增缺陷" @on-ok="newDefect" @on-cancel="cancel" :scrollable="model.scrollable" ok-text="提交">
      <Form :model="defectEntity" :label-width="100" label-position="right">
        <Row>
          <FormItem v-if="field.key==='name'" :prop="field.key" :label="field.title" v-for="(field,index) in newDefectField" :key="index">
            <Input type="text" v-model="defectEntity[field.key]" clearable>
            </Input>
          </FormItem>
        </Row>
        <Row v-for="(field,index) in newDefectField" :key="index">
          <Col span="12" v-if="index%2==0">
          <FormItem :prop="field.key" :label="field.title">
            <Select v-if="field.listId!=''&&field.type.indexOf('List')>-1" v-model="defectEntity[field.key]" clearable>
              <Option v-if="field.listId!=''&&field.type.indexOf('List')>-1" v-for="item in filterList(field.listId)" :value="item" :key="item">{{ item }}
              </Option>
            </Select>
            <DatePicker :transfer="(1===1)" v-else-if="field.type.indexOf('Date')>-1" confirm v-model="defectEntity[field.key]" type="date" placement="bottom-start" placeholder="选择日期" format="yyyy-MM-dd"></DatePicker>
            <Input v-else type="text" v-model="defectEntity[field.key]" clearable>
            </Input>
          </FormItem>
          </Col>
          <Col span="12" v-else>
          <FormItem :prop="field.key" :label="field.title">
            <Select v-if="field.listId!=''&&field.type.indexOf('List')>-1" v-model="defectEntity[field.key]" clearable>
              <Option v-if="field.listId!=''&&field.type.indexOf('List')>-1" v-for="item in filterList(field.listId)" :value="item" :key="item">{{ item }}
              </Option>
            </Select>
            <DatePicker :transfer="(1===1)" v-else-if="field.type.indexOf('Date')>-1" confirm v-model="defectEntity[field.key]" type="date" placement="bottom-start" placeholder="选择日期" format="yyyy-MM-dd"></DatePicker>
            <Input v-else type="text" v-model="defectEntity[field.key]" clearable>
            </Input>
          </FormItem>
          </Col>
        </Row>

      </Form>
    </Modal>
  </Layout>
</template>

<script>
import api from '../qc-api'
import EventBus from '../event-bus'
export default {
    name: 'Smain',
    beforeCreate: function(params) {
        const vm = this
        api
            .isAuthenticated()
            .then(res => {
                api
                    .getDomains()
                    .then(domainNames => {
                        domainNames.forEach(function(domainName, index) {
                            api
                                .getProjects(domainName)
                                .then(projectNames => {
                                    vm.domainList.push({
                                        label: domainName,
                                        projects: projectNames
                                    })
                                })
                                .catch(err => {
                                    console.log('获取项目列表失败')
                                })
                        })
                    })
                    .catch(err => {
                        console.log('获取域列表失败')
                    })
            })
            .catch(res => {
                console.log('跳转登录页面')
                vm.$router.push({ path: '/login' })
            })
    },
    created: function() {
        if (this.domainName != '' && this.projectName != '') {
            Promise.all([this.getLists(), this.getUsers()])
                .then(values => {
                    this.lists = values[0]
                    this.users = values[1]
                    this.getnewDefectField()
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
        }
    },
    data() {
        return {
            model: { show: false, scrollable: true },
            newDefectField: [],
            defectEntity: {},
            lists: [],
            domainList: [],
            projectName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : this.$route.params.dp.split('@')[1],
            domainName:
                typeof this.$route.params.dp === 'undefined'
                    ? ''
                    : this.$route.params.dp.split('@')[0],
            isFullScreen: false
        }
    },
    methods: {
        newDefect() {},
        cancel() {},
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
        getUsers() {
            return new Promise((resolve, reject) => {
                api
                    .getUsers(this.domainName, this.projectName)
                    .then(users => {
                        resolve(users)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        go2Page(path, content) {
            if (this.domainName != '' && this.projectName != '') {
                this.$router.push({
                    path: `${path}/${encodeURIComponent(
                        this.domainName
                    )}@${encodeURIComponent(this.projectName)}`
                })
            } else {
                this.$Notice.warning({
                    title: '注意',
                    desc: content
                })
            }
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
        getnewDefectField() {
            api
                .getFields(this.domainName, this.projectName)
                .then(fieldObjs => {
                    fieldObjs.forEach(v => {
                        if (
                            v.active === 'true' &&
                            v.editable === 'true' &&
                            v.history === 'true'
                        ) {
                            this.newDefectField.push({
                                title: v.label,
                                key: v.key,
                                type: v.type,
                                verify: v.verify,
                                listid: v.listId || ''
                            })
                        }
                    })

                    console.log(this.newDefectField)
                })
                .catch(err => {
                    if (err.response.status === '401') {
                        this.$router.push('/login')
                        retrun
                    }
                    this.$Notice.error({
                        title: '错误信息',
                        desc: '获取缺陷字段出错，请刷新再试！',
                        duration: 0
                    })
                })
        },
        fullScreen() {
            let de = document.documentElement
            if (this.isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
                this.isFullScreen = false
            } else {
                if (de.requestFullscreen) {
                    de.requestFullscreen()
                } else if (de.mozRequestFullScreen) {
                    de.mozRequestFullScreen()
                } else if (de.webkitRequestFullScreen) {
                    de.webkitRequestFullScreen()
                }
                this.isFullScreen = true
            }
            EventBus.$emit('fullscreen', { isFullScreen: this.isFullScreen })
        },
        menuAction(name) {
            switch (name) {
                case '1':
                    if (this.domainName != '' && this.projectName != '') {
                        this.model.show = true
                    } else {
                        this.$Notice.warning({
                            title: '注意',
                            desc: '请在切换项目菜单中先选择一个项目'
                        })
                    }
                    break
                case '2':
                    this.go2Page('/defects', '请在切换项目菜单中先选择一个项目')
                    break
                case '4':
                    this.go2Page('/setting', '请在切换项目菜单中先选择一个项目')
                    break
                case '5':
                    api
                        .logout()
                        .then(res => {
                            this.$router.push({ path: '/login' })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    break
                case '6':
                    this.fullScreen()
                    break

                default:
                    let names = name.split('@')
                    this.projectName = names[1]
                    this.domainName = names[0]
                    this.getnewDefectField()
                    EventBus.$emit('change-project', {
                        projectName: this.projectName,
                        domainName: this.domainName
                    })
                    break
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout-logo {
    height: 30px;
    color: white;
    float: left;
    position: relative;
    user-select: none;
}

.layout-nav {
    width: 650px;
    margin: 0 auto;
    margin-right: 20px;
}
.ivu-menu-submenu-title {
    font-size: 18px;
}
</style>
