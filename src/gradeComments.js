function grade_comments(stars = 4) {
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
          let userId = 0;
          for (let group of groups) {
            for (let user of group.listStudentByGroups) {
              if (user.email == myEmail) {
                userId = user.id;
                groupId = group.id;
                break;
              }
            }
          }
          get(
            "https://fugw-edunext.fpt.edu.vn/api/comment/get-comments",
            { ...options },
            {
              cqId: privateCqId,
              groupId: groupId,
              userId: userId,
              classroomSessionId: classroomSessionId,
              outsideGroup: false,
            }
          )
            .then((d) => d.json())
            .then((d) => {
              let comments = d.comments.items;
              for (let comment of comments) {
                let commentId = comment._id;
                let name = comment.writer.name;
                if (myId == comment.writer._id) continue;
                post("https://fugw-edunext.fpt.edu.vn/api/comment/up-votes", {
                  ...options,
                  body: JSON.stringify({
                    typeStar: 1,
                    cqId: privateCqId,
                    commentId: commentId,
                    star: stars,
                  }),
                }).then((d) => {
                  if (d.status == 200) {
                    showIndicate(`Voted ${stars} ⭐ for ${name}`, "#059669", 2);
                  } else {
                    showIndicate(`FAIL! ${name}`, "#E32E10", 2);
                  }
                });
              }
            });
        });
    });
}

grade_comments();
