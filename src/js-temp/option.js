(function() {
  let almUrl = "http://192.168.42.50:8088";
  let signinUrl = "/qcbin/authentication-point/authenticate";
  let restApiUrl = "/qcbin/rest/";
  $(document).ready(function() {
    $.get(almUrl + "/qcbin/authentication-point/authenticate")
      .success((data, textStatus, xhr) => {
        console.debug(xhr.status);
        initPage(xhr.status);
      })
      .fail(err => {
        console.log(err.responseText);
      });
  });

  function initPage(status) {
    if (status === 200) {
      getDomains();
    } else if (status === 401) {
    } else {
    }
  }

  

  function getDomains() {
    $.get(almUrl + restApiUrl + "domains")
      .done((data, textStatus, xhr) => {
        $("#areaField").empty();
        $(data)
          .find("Domain")
          .each(function() {
            console.log($(this).attr("Name"));
            $("#areaField").append(
              '<option value="' +
                $(this).attr("Name") +
                '">' +
                $(this).attr("Name") +
                "</option>"
            );
          });

        getProjects($("#areaField").val());
      })
      .fail(err => {
        console.log(err);
      });
  }

  var fieldMaps = new Map();
  /**
   * 获取项目列表
   *
   * @param {any} domainName 域名称
   */
  function getProjects(domainName) {
    $.get(almUrl + restApiUrl + "domains/" + domainName + "/projects")
      .success((data, textStatus, xhr) => {
        $("#projectField")
          .empty()
          .append('<option value="……">请选择项目</option>');
        $(data)
          .find("Project")
          .each(function() {
            //$(this).attr('Name')
            console.log($(this).attr("Name"));
            let projectName = $(this).attr("Name");
            $("#projectField").append(
              '<option value="' + projectName + '">' + projectName + "</option>"
            );
            getDefectFields(domainName, projectName, function(err, map) {
              if (!err) {
                fieldMaps.set(projectName, map);
              } else {
                alert("获取字段出错！");
              }
            });
          });
      })
      .fail(err => {
        console.log(err);
      });
  }
  /**
   * 获取缺陷字段名称列表
   *
   * @param {any} domainName 域名称
   * @param {any} projectName 项目名称
   */
  function getDefectFields(domainName, projectName, cb) {
    return $.get(
      almUrl +
        restApiUrl +
        "domains/" +
        domainName +
        "/projects/" +
        projectName +
        "/customization/entities/defect/fields"
    )
      .success((data, textStatus, xhr) => {
        let map = new Map();
        $(data)
          .find("Field")
          .each(function() {
            map.set($(this).attr("Name"), $(this).attr("Label"));
          });
        cb(null, map);
      })
      .fail(err => {
        console.log(err);
        cb(err, null);
      });
  }

  /**
   * 查询缺陷
   *
   * @param {any} domainName 域名称
   * @param {any} projectName 项目名称
   * @param {any} queryString 查询字符串:id[ = "1"  Or  = "2"]
   * @param {any} showFields 显示字段:id, name, severity, detected - by
   */
  function queryDefects(
    domainName,
    projectName,
    queryString = "id[<=1]",
    showFields = ""
  ) {
    $.get(
      almUrl +
        restApiUrl +
        "domains/" +
        domainName +
        "/projects/" +
        projectName +
        "/defects?fields=" +
        showFields +
        "&query={" +
        queryString +
        "}"
    )
      .success((data, textStatus, xhr) => {
        $("#defectList>tbody").empty();
        $(data)
          .find("Entity")
          .each(function(row, v) {
            //$(this).attr('Name')
            let tds = "";
            if (row === 0) {
              $("#defectList>thead>tr").empty();
            }
            $(this)
              .find("Field")
              .each(function(i, v) {
                let name = $(this).attr("Name");
                let value = $(this)
                  .find("Value")
                  .text();
                //console.log($(this).attr('Name') + ":" + $(this).find('Value').text());
                if (row === 0) {
                  $("#defectList>thead>tr").append(
                    "<th nowrap='nowrap'>" +
                      fieldMaps.get(projectName).get(name) +
                      "</th>"
                  );
                }
                tds = tds + "<td nowrap='nowrap'>" + value + "</td>";
              });
            $("#defectList>tbody").append("<tr>" + tds + "</tr>");
          });
      })
      .fail(err => {
        console.log(err);
      });
  }

  $("#areaField").on("change", () => {
    getProjects($("#areaField").val());
  });

  $("#projectField").on("change", () => {
    if ($("#projectField").val() != "……") {
      queryDefects($("#areaField").val(), $("#projectField").val(), "id[<=10]");
    }
  });
})();
