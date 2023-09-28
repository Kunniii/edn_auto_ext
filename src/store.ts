import { defineStore } from "pinia";
import { message, response, state, user } from "./utils/types";
import { endpoints } from "./utils/endpoints";
import { utils } from "./utils";

const delay = 1500;

let user: user;
let appReady: true | false = true;
let gradeTeammatesState: state = "static";
let gradeGroupsState: state = "static";
let gradeCommentsState: state = "static";

export const useStore = defineStore("store", {
  state: () => ({
    TOKEN: "",
    currentURL: undefined,
    appReady,
    user,
    gradeTeammatesState,
    gradeGroupsState,
    gradeCommentsState,
  }),
  getters: {
    version(state) {
      return "v" + chrome.runtime.getManifest().version;
    },
  },
  actions: {
    callGetUrl() {
      const msg: message = { command: "get_url" };
      chrome.runtime.sendMessage(msg, (response: response) => {
        this.currentURL = new URL(response.data);
        if (this.currentURL.host !== "fu-edunext.fpt.edu.vn") {
          this.appReady = false;
        }
        if (this.currentURL.pathname !== "/course/activity/question") {
          this.gradeTeammatesState = "disable";
          this.gradeGroupsState = "disable";
          this.gradeCommentsState = "disable";
        }
      });
    },
    callGetToken() {
      const msg: message = { command: "get_token" };
      chrome.runtime.sendMessage(msg, (response: response) => {
        this.TOKEN = response.data;
        const [b64Header, b64Payload, signature] = this.TOKEN.split(".");
        this.user = JSON.parse(utils.base64decode(b64Payload));
      });
    },
    async gradeTeammates() {
      this.gradeTeammatesState = "pending";

      const privateCqId = this.currentURL.searchParams.get("id");
      const classroomId = this.currentURL.searchParams.get("classId");
      const sessionId = this.currentURL.searchParams.get("sessionId");

      let sessionDetails: response = await utils.get(endpoints.qcSettings, this.TOKEN, {
        privateCqId: privateCqId,
      });

      if (sessionDetails.data) {
        try {
          let data = sessionDetails.data.data;
          const classroomSessionId = data.cqDetail.classroomSessionId;

          let groups: response = await utils.post(endpoints.listGroups, this.TOKEN, {
            classroomSessionId: classroomSessionId,
          });

          if (groups.data.length > 1) {
            let groupId = 0;
            let myGroup;
            let gradeTeammatesList: Object[] = [];
            for (let group of groups.data) {
              for (let user of group.listStudentByGroups) {
                if (user.email == this.user.email) {
                  groupId = group.id;
                  this.user.groupId = group.id;
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
                hardWorking: 5,
                goodKnowledge: 5,
                teamWorking: 5,
              });
            }
            if (gradeTeammatesList.length < 1) {
              this.gradeTeammatesState = "ok";
            } else {
              let response: response = await utils.post(
                endpoints.gradeTeammates,
                this.TOKEN,
                undefined,
                {
                  gradeTeammatesList: gradeTeammatesList,
                }
              );
              if (response.ok) {
                this.gradeTeammatesState = "ok";
              } else {
                this.gradeTeammatesState = "failed";
              }
            }
          }
        } catch {
          this.gradeTeammatesState = "failed";
        }
      } else {
        this.gradeTeammatesState = "failed";
      }

      if (this.gradeTeammatesState === "failed") {
        setTimeout(() => {
          this.gradeTeammatesState = "static";
        }, delay);
      }
    },
    async gradeGroups() {
      this.gradeGroupsState = "pending";

      let privateCqId = this.currentURL.searchParams.get("id");

      let roundDetails: response = await utils.get(endpoints.roundDetails, this.TOKEN, {
        privateCqId: privateCqId,
      });

      if (roundDetails.data) {
        const classroomSessionId = roundDetails.data.data[0].classroomSessionId;
        let myGroup;

        let groups: response = await utils.post(endpoints.listGroups, this.TOKEN, {
          classroomSessionId: classroomSessionId,
        });

        for (let group of groups.data) {
          for (let user of group.listStudentByGroups) {
            if (user.email == this.user.email) {
              myGroup = group;
              break;
            }
          }
        }

        let gradeAbleGroups = roundDetails.data.data.filter(
          (round) => round.presentGroupId != myGroup.id
        );

        if (gradeAbleGroups.length < 1) {
          this.gradeGroupsState = "ok";
        } else {
          for (let group of gradeAbleGroups) {
            let body = {
              privateCqId: privateCqId,
              roundId: group.roundId,
              classroomSessionId: group.classroomSessionId,
              bonusPoint: 0,
              presentingGroupDTO: {
                keepTime: 5,
                meetRequirement: 5,
                presentations: 5,
                goodInformation: 5,
                presentGroupId: group.presentGroupId,
              },
              reviewingGroupDTO: null,
            };

            let response = await utils.post(endpoints.gradeGroups, this.TOKEN, undefined, body);

            if (response.ok && this.gradeGroupsState !== "failed") {
              this.gradeGroupsState = "ok";
            }
          }
        }
      } else {
        this.gradeGroupsState = "failed";
      }

      if (this.gradeGroupsState === "failed") {
        setTimeout(() => {
          this.gradeGroupsState = "static";
        }, delay);
      }
    },
    async gradeComments() {
      this.gradeCommentsState = "pending";

      const privateCqId = this.currentURL.searchParams.get("id");
      const classroomId = this.currentURL.searchParams.get("classId");
      const sessionId = this.currentURL.searchParams.get("sessionId");

      // get settings for the QC
      const qcSettings: response = await utils.get(endpoints.qcSettings, this.TOKEN, {
        privateCqId: privateCqId,
      });
      if (qcSettings.data.data) {
        const settings = qcSettings.data.data;
        const hashCode: string = settings.hashCode;
        const classroomSessionId: string = settings.cqDetail.classroomSessionId;
        let voteQueue: Number[] = [];
        const typeStar = {
          1: 4,
          2: 3,
          3: 2,
          4: 1,
        };
        const insideSettings = settings.typeOfGrade.INSIDE;

        for (let cardName in insideSettings) {
          for (let quantity = 0; quantity < insideSettings[cardName].quantity; ++quantity) {
            voteQueue.push(insideSettings[cardName].star);
          }
        }

        // get votes that user gave
        const allVoted: response = await utils.get(endpoints.getVoteGiven, this.TOKEN, {
          privateCqId: privateCqId,
          typeFilter: 1,
        });
        if (allVoted.data.data) {
          const comments = allVoted.data.data;
          for (let comment of comments) {
            // unvote
            await utils.post(endpoints.unVote, this.TOKEN, undefined, {
              commentId: comment._id,
              cqId: privateCqId,
            });
          }

          // get all comments
          const allComments: response = await utils.get(endpoints.getComments, this.TOKEN, {
            cqId: privateCqId,
            role: this.user.role,
            userId: this.user.userId,
            classroomSessionId: classroomSessionId,
            groupId: this.user.groupId,
            outsideGroup: false,
            minItemId: "empty",
            maxItemId: "empty",
            beforePage: 1,
            currentPage: 1,
            statusClickAll: false,
            pageSize: 999,
            hashCode: hashCode,
          });

          if (allComments.data.comments) {
            let comments = allComments.data.comments.items;
            for (let comment of comments) {
              if (comment.writer._id === this.user.id) continue;
              if (voteQueue.length > 0) {
                const star = voteQueue.shift() || "";
                await utils.post(endpoints.upVote, this.TOKEN, undefined, {
                  commentId: comment._id,
                  cqId: privateCqId,
                  star: star,
                  typeStar: typeStar[+star],
                  typeFilter: 1,
                });
              }
            }
          }
          this.gradeCommentsState = "ok";
        }
      }
    },
  },
});
