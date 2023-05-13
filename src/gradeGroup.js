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
      try {
        let gradeAbleGroups = groupGrades;
        if (gradeAbleGroups.length < 1) {
          showIndicate(`FAIL! No group to grade!`, "#E32E10", 4);
          return;
        }
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
            } else {
              showIndicate(`FAIL! Grade group ${group.presentGroupId}`, "#E32E10", 4);
            }
          });
        }
      } catch {
        showIndicate(`FAIL! No group to grade!`, "#E32E10", 4);
      }
    });
}

grade_group();
