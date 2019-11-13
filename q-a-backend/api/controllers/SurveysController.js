module.exports = {
  create: (req, res) => {
    try {
      const contentSurvey = req.body.contentSurvey;
      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      const owner = userInfo.id;
      if (userInfo.role === "student") {
        return res.badRequest("Bạn không đủ quyền!!!");
      }
      if (!contentSurvey || contentSurvey === "") {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      Surveys.create({ contentSurvey: contentSurvey, owner: owner }).exec(
        (err, survey) => {
          if (err) {
            return res.serverError("Database error");
          }
          if (survey) {
            return res.ok({
              message: "Tạo câu khảo sát thành công",
              survey: survey,
              nameOfOwner: userInfo.name
            });
          }
        }
      );
    } catch (error) {
      return res.serverError("Internal Server Error");
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
  edit: (req, res) => {
    try {
      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      if (userInfo.role === "student") {
        return res.badRequest("Bạn không đủ quyền!!!");
      }
      const surveyId = req.params.id;
      const contentSurvey = req.body.contentSurvey;
      if (!contentSurvey || contentSurvey === "") {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      Surveys.update({ id: surveyId }, { contentSurvey: contentSurvey }).exec(
        (err, surveys) => {
          if (err) {
            return res.serverError("Database error");
          }
          if (surveys.length === 0) {
            return res.notFound("Không tìm thấy câu khảo sát");
          } else {
            return res.ok("Sửa thành công");
          }
        }
      );
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  }
};
