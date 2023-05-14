const notificationStyle = document.createElement("style");
notificationStyle.textContent = `
@keyframes fadein {
  from {opacity: 0; transform: translateY(-100%);}
  to {opacity: 1; transform: translateY(0);}
}

@keyframes fadeout {
  from {opacity: 1; transform: translateY(0);}
  to {opacity: 0; transform: translateY(-100%);}
}
`;

document.head.appendChild(notificationStyle);

let yOffset = window.yOffset || 0;
let offsetAmount = 75;

function showIndicate(text, color, seconds) {
  const notification = document.createElement("div");
  notification.style.backgroundColor = color;
  notification.style.animation = "fadein 0.5s, fadeout 2s 2s";
  notification.style.position = "fixed";
  notification.style.width = "20rem";
  notification.style.top = `${10 + yOffset}px`;
  notification.style.right = "20px";
  notification.style.padding = "20px";
  notification.style.borderRadius = "15px";
  notification.style.zIndex = "99999";
  notification.style.fontWeight = "bold";
  notification.style.color = "white";

  notification.innerHTML = text;
  document.body.prepend(notification);

  window.yOffset += offsetAmount;

  setTimeout(function () {
    document.body.removeChild(notification);
    if (window.yOffset <= 0) {
      window.yOffset = 0;
    } else {
      window.yOffset -= offsetAmount;
    }
  }, 1000 * seconds);
}

let token = localStorage.getItem("token");
let myEmail = JSON.parse(atob(token.split(".")[1])).email;
const API = "https://fugw-edunext.fpt.edu.vn/api/v1";

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
    authority: "fugw-edunext.fpt.edu.vn",
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
          if (groups.length < 1) {
            showIndicate("FAIL! No teammate to grade", "#E32E10", 4);
            return;
          }
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
          for (let user of myGroup.listStudentByGroups) {
            let userIsGraded = user.id;
            let userIsGradedId = user.id;
            gradeTeammatesList.push({
              groupId: groupId,
              classroomSessionId: classroomSessionId,
              privateCqId: privateCqId,
              userIsGraded: userIsGraded,
              userIsGradedId: userIsGradedId,
              hardWorking: stars,
              goodKnowledge: stars,
              teamWorking: stars,
            });
          }
          if (gradeTeammatesList.length < 1) {
            showIndicate("FAIL! No teammate to grade", "#E32E10", 4);
            return;
          }
          post(`${API}/grade/grade-teammates`, {
            ...options,
            body: JSON.stringify({
              gradeTeammatesList: gradeTeammatesList,
            }),
          }).then((d) => {
            if (d.status == 200) {
              showIndicate("Teammates graded", "#f4c430", 4);
            } else {
              showIndicate("FAIL! Teammates graded", "#E32E10", 4);
            }
          });
        });
    });
}

grade_indie();
