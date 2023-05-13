let token = localStorage.getItem("token");
let myEmail = JSON.parse(atob(token.split(".")[1])).email;
const API = "https://fugw-edunext.fpt.edu.vn:8443/api/v1";

function get(url, options, params) {
  if (params) {
    return fetch(url + "?" + new URLSearchParams(params), { ...options, method: "GET" });
  } else {
    return fetch(url, { ...options, method: "GET" });
  }
}

function post(url, options, params) {
  if (params) {
    return fetch(url + "?" + new URLSearchParams(params), { ...options, method: "POST" });
  } else {
    return fetch(url, { ...options, method: "POST" });
  }
}

const options = {
  headers: {
    authority: "fugw-edunext.fpt.edu.vn:8443",
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  },
};

function grade_group(stars = 5) {
  let url = new URL(document.URL);
  let pathname = url.pathname;
  if (pathname !== "/course/activity/question") return;
  let privateCqId = url.searchParams.get("id");
  get(`${API}/round/get`, { ...options }, { privateCqId: privateCqId })
    .then((d) => d.json())
    .then((d) => {
      let groupGrades = d.data;
      let gradeAbleGroups = groupGrades.filter((d) => d.presentGroupGrade);
      for (let group of gradeAbleGroups) {
        let body = {
          privateCqId: privateCqId,
          roundId: group.roundId,
          classroomSessionId: group.classroomSessionId,
          bonusPoint: 0,
          presentingGroupDTO: {
            keepTime: stars,
            meetRequirement: stars,
            presentations: stars,
            goodInformation: stars,
            presentGroupId: group.presentGroupId,
          },
          reviewingGroupDTO: null,
        };
        post(`${API}/grade/grading-group`, {
          ...options,
          body: JSON.stringify(body),
        }).then((d) => {
          if (d.status == 200) {
            showIndicate(`Group ${group.presentGroupId} graded`, "#7e8efb", 4);
          }
        });
      }
    });
}

grade_group();
