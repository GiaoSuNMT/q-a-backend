module.exports = {
  create: (req, res) => {
    try {
      const contentSurvey = req.body.contentSurvey;
      const description = req.body.description;
      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      const owner = userInfo.id;
      const closedAt = !req.body.closedAt ? null : req.body.closedAt;
      let listOptions = "";
      if (req.body.listOptions) {
        listOptions = req.body.listOptions;
      }

      if (userInfo.role === "student") {
        return res.badRequest("Bạn không đủ quyền!!!");
      }
      if (
        !contentSurvey ||
        contentSurvey === "" ||
        !description ||
        description === ""
      ) {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      if (closedAt) {
        if (new Date(closedAt).getTime() - Date.now() < 5 * 60 * 1000) {
          // ngày đóng phải hơn tối thiểu 5 phút so với hiện tại
          return res.badRequest(
            `Ngày đóng phải lớn hơn ${new Date(
              Date.now() + 5 * 60 * 1000
            ).toLocaleString()}`
          );
        }
      }
      Surveys.create({
        contentSurvey: contentSurvey,
        description: description,
        closedAt: closedAt,
        owner: owner
      }).exec(async (err, survey) => {
        if (err) {
          return res.serverError("Database error");
        }
        if (survey) {
          // default options
          if (listOptions) {
            for (let index = 0; index < listOptions.length; index++) {
              await Options.create({
                contentOption: listOptions[index],
                surveyId: survey.id,
                owner: survey.owner
              }).exec((err, option) => {
                if (err) {
                  return res.serverError(err);
                }
              });
            }
          }

          return res.ok({
            message: "Tạo câu khảo sát thành công",
            survey: survey,
            nameOfOwner: userInfo.name
          });
        }
      });
    } catch (error) {
      return res.serverError(error);
    }
  },
  list: (req, res) => {
    try {
      Surveys.find().exec((err, surveys) => {
        if (err) {
          return res.serverError("Database error");
        }
        res.ok(surveys);
      });
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  delete: (req, res) => {
    try {
      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      if (userInfo.role === "student") {
        return res.badRequest("Bạn không đủ quyền!!!");
      }
      const surveyId = req.params.id;
      Surveys.destroy({ id: surveyId }).exec((err, surveys) => {
        if (err) {
          return res.serverError("Database error");
        }
        if (surveys.length === 0) {
          return res.notFound("Không tìm thấy câu khảo sát");
        } else {
          Options.destroy({ surveyId: surveyId }).exec((err, options) => {
            if (err) {
              return res.serverError("Database error");
            }
          });
          return res.ok("Xóa câu khảo sát thành công");
        }
      });
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  openSurvey: (req, res) => {
    try {
      const { id, closedAt } = req.body;
      const date = new Date(closedAt);
      // console.log(date instanceof Date && !isNaN(date));
      if (date instanceof Date && !isNaN(date)) {
        if (new Date(date).getTime() - Date.now() < 5 * 60 * 1000) {
          return res.badRequest("Phiên hỏi đáp phải được mở tối thiểu 5 phút");
        }
        Surveys.update({ id: id }, { closedAt: date }).exec((err, session) => {
          if (err) {
            return res.serverError("Database Error");
          }
          return res.ok({ message: "Thành công", closedAt: date });
        });
      } else {
        return res.badRequest("Không đúng định dạng");
      }
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  closeSurvey: (req, res) => {
    try {
      const { id } = req.body;
      Surveys.update({ id: id }, { closedAt: Date(Date.now()) }).exec(
        (err, session) => {
          if (err) {
            return res.serverError("Database Error");
          }
          return res.ok({ message: "Thành công", closedAt: Date(Date.now()) });
        }
      );
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  edit: (req, res) => {
    try {
      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      if (userInfo.role === "student") {
        return res.badRequest("Bạn không đủ quyền!!!");
      }
      const surveyId = req.params.id;
      const contentSurvey = req.body.contentSurvey;
      const description = req.body.description;
      if (
        !contentSurvey ||
        contentSurvey === "" ||
        !description ||
        description === ""
      ) {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      Surveys.update(
        { id: surveyId },
        { contentSurvey: contentSurvey, description: description }
      ).exec((err, surveys) => {
        if (err) {
          return res.serverError("Database error");
        }
        if (surveys.length === 0) {
          return res.notFound("Không tìm thấy câu khảo sát");
        } else {
          return res.ok("Sửa thành công");
        }
      });
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  }
};
