import $ from 'jquery'
import axios from 'axios'

export function getFields(domainName, projectName) {
  return axios
    .get(
      `/qcbin/rest/domains/${domainName}/projects/${projectName}/customization/entities/defect/fields`
    )
    .then(
      res => {
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
                verify: vtmp.find('Verify').text()
              }
              fieldArray.push(tmpObj)
            }
          })
        return fieldArray
      },
      res => {
        return null
      }
    )
}
export function isAuthenticated() {
  return axios.get('/qcbin/rest/is-authenticated').then(
    res => {
      return res
    },
    res => {
      return null
    }
  )
}
export function getDomains() {
  return axios.get('/qcbin/rest/domains/').then(
    res => {
      let domainNames = []
      $(res.data)
        .find('Domain')
        .each(function() {
          let dname = $(this).attr('Name')
          domainNames.push(dname)
        })
      return domainNames
    },
    res => {
      return null
    }
  )
}
export function getProjects(domainName) {
  return axios.get(`/qcbin/rest/domains/${domainName}/projects`).then(
    res => {
      let projectNames = []
      $(res.data)
        .find('Project')
        .each(function() {
          let pname = $(this).attr('Name')
          projectNames.push(pname)
        })
      return projectNames
    },
    res => {
      return null
    }
  )
}
export function getDefects(
  domainName,
  projectName,
  fields = ['id', 'subject'],
  query = ''
) {
  return axios
    .get(
      `/qcbin/rest/domains/${domainName}/projects/${projectName}/defects?fields=${fields.join(
        ','
      )}&query={${query}}`
    )
    .then(
      res => { 
        let totNum = $(res.data)[1].attributes[0].value
        let entitiesData=[]
        let returnNum=0
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
          return { totNum: totNum, returnNum: returnNum, data: entitiesData }
      },
      res => {}
    )
}
export default {
  getFields: getFields,
  isAuthenticated: isAuthenticated,
  getDomains: getDomains,
  getProjects: getProjects,
  getDefects: getDefects
}
