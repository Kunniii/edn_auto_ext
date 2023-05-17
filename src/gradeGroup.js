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
          showIndicate(`FAIL! No group to grade!`, "#E32E10", 2);
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
              showIndicate(`Group ${group.presentGroupId} graded`, "#453BBA", 2);
            } else {
              showIndicate(`FAIL! Grade group ${group.presentGroupId}`, "#E32E10", 2);
            }
          });
        }
      } catch {
        showIndicate(`FAIL! No group to grade!`, "#E32E10", 2);
      }
    });
}

grade_group();