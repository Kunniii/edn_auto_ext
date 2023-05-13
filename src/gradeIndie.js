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

function grade_indie(stars = 5) {
  let url = new URL(document.URL);
  let pathname = url.pathname;
  if (pathname !== "/course/activity/question") return;
  let privateCqId = url.searchParams.get("id");
  let classroomId = url.searchParams.get("classId");
  let sessionId = url.searchParams.get("sessionId");
  get(
    `${API}/course/course-detail/session-detail`,
    { ...options },
    {
      sessionId: sessionId,
      classroomId: classroomId,
    }
  )
    .then((d) => d.json())
    .then((d) => {
      let data = d.data[0];
      let classroomSessionId = data.classroomSessionId;
      post(`${API}/group/list-group`, { ...options }, { classroomSessionId: classroomSessionId })
        .then((d) => d.json())
        .then((groups) => {
          let groupId = 0;
          let myGroup = {};
          let myId = 0;
          let gradeTeammatesList = [];
          for (let group of groups) {
            for (let user of group.listStudentByGroups) {
              if (user.email == myEmail) {
                myId = user.id;
                groupId = group.id;
                myGroup = group;
                break;
              }
            }
          }
          post(`${API}/grade/get-grade`, {
            ...options,
            body: JSON.stringify({ groupId: groupId, privateCqId: privateCqId }),
          })
            .then((d) => d.json())
            .then((d) => {
              let grade = {
                hardWorking: stars,
                goodKnowledge: stars,
                teamWorking: stars,
              };
              let gradeResponseList = d.data.gradeResponseList;
              for (let user of gradeResponseList) {
                if (user.id == myId) continue;
                gradeTeammatesList.push({ ...user, ...grade, userIsGradedId: user.userIsGraded });
              }
              post(`${API}/grade/grade-teammates`, {
                ...options,
                body: JSON.stringify({
                  gradeTeammatesList: gradeTeammatesList,
                }),
              }).then((d) => {
                if (d.status == 200) {
                  showIndicate("Individual graded", "#38761d", 4);
                }
              });
            });
        });
    });
}

grade_indie();
