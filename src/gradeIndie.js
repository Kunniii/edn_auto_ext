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
      let data;
      try {
        data = d.data[0];
      } catch {
        showIndicate("ERROR! Please reload EduNext!!!", "#E32E10", 2);
        return;
      }
      let classroomSessionId = data.classroomSessionId;
      post(`${API}/group/list-group`, { ...options }, { classroomSessionId: classroomSessionId })
        .then((d) => d.json())
        .then((groups) => {
          if (groups.length < 1) {
            showIndicate("FAIL! No teammate to grade", "#E32E10", 2);
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
            showIndicate("FAIL! No teammate to grade", "#E32E10", 2);
            return;
          }
          post(`${API}/grade/grade-teammates`, {
            ...options,
            body: JSON.stringify({
              gradeTeammatesList: gradeTeammatesList,
            }),
          }).then((d) => {
            if (d.status == 200) {
              showIndicate("Teammates graded", "#f4c430", 2);
            } else {
              showIndicate("FAIL! Teammates graded", "#E32E10", 2);
            }
          });
        });
    });
}

grade_indie();
