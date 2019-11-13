module.exports = {
  create: (req, res) => {
    try {
      let temp = {
        contentOption: req.body.contentOption,
        surveyId: req.body.surveyId,
        owner: req.body.owner,
        voteUsers: []
      };
      if (!temp.contentOption || temp.contentOption === "") {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      Options.findOne({ contentOption: temp.contentOption }).exec(
        (err, option) => {
          if (err) {
            return res.serverError(err);
          }
          if (option) {
            return res.badRequest("Lựa chọn đã tồn tại!");
          } else {
            Options.create({
              contentOption: temp.contentOption,
              surveyId: temp.surveyId,
              owner: temp.owner,
              voteUsers: temp.voteUsers
            }).exec((err, option) => {
              if (err) {
                return res.serverError(err);
              }
              if (option) {
                return res.ok({
                  message: "Tạo lựa chọn thành công",
                  option: option,
                  nameOfOwner: temp.owner
                });
              }
            });
          }
        }
      );
    } catch (error) {
      return res.serverError(error);
    }
  },
  list: (req, res) => {
    try {
      Options.find().exec((err, options) => {
        if (err) {
          return res.serverError("Database error");
        }
        res.ok(options);
      });
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  delete: (req, res) => {
    try {
      const optionId = req.params.id;
      Options.destroy({ id: optionId }).exec((err, options) => {
        if (err) {
          return res.serverError("Database error");
        }
        if (options.length === 0) {
          return res.notFound("Không tìm thấy lựa chọn");
        } else {
          return res.ok("Xóa lựa chọn thành công");
        }
      });
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  edit: (req, res) => {
    try {
      const optionId = req.params.id;
      const contentOption = req.body.contentOption;
      if (!contentOption || contentOption === "") {
        return res.badRequest("Vui lòng điển đầy đủ thông tin !!!");
      }
      Options.update({ id: optionId }, { contentOption: contentOption }).exec(
        (err, options) => {
          if (err) {
            return res.serverError("Database error");
          }
          if (options.length === 0) {
            return res.notFound("Không tìm thấy lựa chọn");
          } else {
            return res.ok("Sửa thành công");
          }
        }
      );
    } catch (error) {
      return res.serverError("Internal Server Error");
    }
  },
  vote: async (req, res) => {
    try {
      const optionId = req.params.id;

      const token = req.cookies.access_token.split(" ")[1];
      const userInfo = jwToken.decoded(token);
      const userVote = userInfo.id;

      const voteOption = await Options.findOne({ id: optionId });
      if (!voteOption) {
        return res.notFound("Không tìm thấy lựa chọn");
      } else {
        let arrVote = voteOption.voteUsers;
        for (let index = 0; index < arrVote.length; index++) {
          if (arrVote[index] === userVote) {
            let votes = 0;
            if (voteOption.votes > 0) {
              votes = voteOption.votes - 1;
            }

            arrVote.splice(index, 1);
            let option = await Options.update(
              { id: optionId },
              { votes: votes, voteUsers: arrVote }
            );
            if (option.length === 0) {
              return res.notFound("Không tìm thấy lựa chọn");
            } else {
              return res.ok("Bỏ vote thành công");
            }
          }
        }
        let votes = voteOption.votes + 1;
        arrVote.push(userVote);
        await Options.update(
          { id: optionId },
          { votes: votes, voteUsers: arrVote }
        ).exec((err, options) => {
          if (err) {
            return res.serverError("Database error");
          }
          if (options.length === 0) {
            return res.notFound("Không tìm thấy lựa chọn");
          } else {
            return res.ok("Vote thành công");
          }
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  }
};
