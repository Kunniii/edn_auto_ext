const BASE = "https://fugw-edunext.fpt.edu.vn";
const PORT = ":8443";

const API_BASE = BASE + PORT + "/api/v1";

export const endpoints = {
  auth: `${BASE}/api/auth/token`,
  getVoteGiven: `${BASE}/api/comment/get-vote-given`,
  unVote: `${BASE}/api/comment/un-votes`,
  upVote: `${BASE}/api/comment/up-votes`,
  getComments: `${BASE}/api/comment/get-comments`,
  courseSessionDetail: `${API_BASE}/course/course-detail/session-detail`,
  listGroups: `${API_BASE}/group/list-group`,
  gradeTeammates: `${API_BASE}/grade/grade-teammates`,
  roundDetails: `${API_BASE}/round/get`,
  gradeGroups: `${API_BASE}/grade/grading-group`,
  qcSettings: `${API_BASE}/cq-setting/get-cq-setting`,
};
