import $ from 'jquery'
import axios from 'axios'
axios.defaults.withCredentials = true

export function getFields(domainName, projectName, queryParam = '') {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/qcbin/rest/domains/${domainName}/projects/${projectName}/customization/entities/defect/fields?${queryParam}`
      )
      .then(res => {
        let fieldArray = []
        $(res.data)
          .find('Field')
          .each(function() {
            let vtmp = $(this)
            if (vtmp.find('Active').text() === 'true') {
              let tmpObj = {
                key: vtmp.attr('Name'),
                label: vtmp.attr('Label'),
                required: vtmp.find('Required').text(),
                system: vtmp.find('System').text(),
                type: vtmp.find('Type').text(),
                active: vtmp.find('Active').text(),
                editable: vtmp.find('Editable').text(),
                history: vtmp.find('History').text(),
                verify: vtmp.find('Verify').text(),
                listId: vtmp.find('List-Id').text() || ''
              }
              if (tmpObj.type === 'Memo') {
                tmpObj.disabled = true
              }
              fieldArray.push(tmpObj)
            }
          })
        resolve(fieldArray)
      })
      .catch(err => {
        reject(err)
        console.log('get fields fail：')
        console.log(err)
      })
  })
}
export function isAuthenticated() {
  return new Promise((resolve, reject) => {
    axios
      .get('/qcbin/rest/is-authenticated')
      .then(res => {
        resolve('is login')
      })
      .catch(err => {
        reject(err)
        console.log('no login:')
        console.log(err)
      })
  })
}
export function login(
  user = {
    account: '',
    passwd: ''
  }
) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/qcbin/authentication-point/authenticate',
      method: 'get',
      auth: {
        username: user.account,
        password: user.passwd
      }
    })
      .then(res => {
        if (res.status === 200) {
          resolve('login success')
        } else {
          reject(res)
          console.log('login fail:')
          console.log(res)
        }
      })
      .catch(err => {
        reject(err)
        console.log('login fail:')
        console.log(err)
      })
  })
}

export function logout() {
  return new Promise((resolve, reject) => {
    axios
      .get('/qcbin/authentication-point/logout')
      .then(res => {
        resolve('logout success')
      })
      .catch(err => {
        console.log('登出失败')
        console.log(err)
        reject(err)
      })
  })
}

export function getDomains() {
  return new Promise((resolve, reject) => {
    axios
      .get('/qcbin/rest/domains/')
      .then(res => {
        let domainNames = []
        $(res.data)
          .find('Domain')
          .each(function() {
            let dname = $(this).attr('Name')
            domainNames.push(dname)
          })
        resolve(domainNames)
      })
      .catch(err => {
        reject(err)
        console.log('get domains fail:')
        console.log(err)
      })
  })
}
export function getProjects(domainName) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/qcbin/rest/domains/${domainName}/projects`)
      .then(res => {
        let projectNames = []
        $(res.data)
          .find('Project')
          .each(function() {
            let pname = $(this).attr('Name')
            projectNames.push(pname)
          })
        resolve(projectNames)
      })
      .catch(err => {
        reject(err)
        console.log('get projectNames fail：')
        console.log(err)
      })
  })
}
export function getUsers(domainName, projectName, queryParam='') {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/qcbin/rest/domains/${domainName}/projects/${projectName}/customization/users?${queryParam}`
      )
      .then(res => {
        let users = []
        $(res.data)
          .find('User')
          .each(function() {
            let name = $(this).attr('Name')
            let fullname = $(this).attr('FullName')
            users.push({ name: name, fullname: fullname })
          })
        resolve(users)
      })
      .catch(err => {
        reject(err)
        console.log('get projectNames fail：')
        console.log(err)
      })
  })
}

export function getLists(domainName, projectName) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/qcbin/rest/domains/${domainName}/projects/${projectName}/customization/lists`
      )
      .then(res => {
        let lists = []
        $(res.data)
          .find('List')
          .each(function() {
            let id = $(this)
              .find('Id')
              .text()
            let name = $(this)
              .find('Name')
              .text()
            let items = []
            $(this)
              .find('Item')
              .each(function() {
                items.push($(this).attr('Value'))
              })
            lists.push({
              id: id,
              name: name,
              items: items
            })
          })
        resolve(lists)
      })
      .catch(err => {
        console.log('get lists fail:')
        console.log(err)
        reject(err)
      })
  })
}
export function getDefects(
  domainName,
  projectName,
  fields = ['id', 'name'],
  query = '',
  offset = 1,
  queryNum = 20
) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/qcbin/rest/domains/${domainName}/projects/${projectName}/defects?fields=${fields.join(
          ','
        )}&query={${query}}&page-size=${queryNum}&start-index=${offset}`
      )
      .then(res => {
        let totNum = $(res.data)[1].attributes[0].value
        let entitiesData = []
        let returnNum = 0
        $(res.data)
          .find('Entity')
          .each(function() {
            let entityData = {}
            fields.forEach((item, index) => {
              if (
                $(this)
                  .find(`Field[Name=${item}]`)
                  .find('Value').length == 0
              ) {
                entityData[item] = ''
              } else {
                entityData[item] = $(this)
                  .find(`Field[Name=${item}]`)
                  .find('Value')
                  .text()
              }
            })
            returnNum++
            entitiesData.push(entityData)
          })
        resolve({
          totNum: totNum,
          returnNum: returnNum,
          data: entitiesData
        })
      })
      .catch(err => {
        reject(err)
        console.log('get defects fail:')
        console.log(err)
      })
  })
}
export default {
  getFields: getFields,
  isAuthenticated: isAuthenticated,
  getDomains: getDomains,
  getProjects: getProjects,
  getDefects: getDefects,
  login: login,
  logout: logout,
  getLists: getLists,
  getUsers: getUsers
}
