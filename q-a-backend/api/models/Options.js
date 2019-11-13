module.exports = {
  attributes: {
    id: {
      primaryKey: true,
      type: "integer",
      autoIncrement: true
    },
    contentOption: {
      type: "string"
    },
    votes: {
      type: "integer",
      defaultsTo: 0
    },
    voteUsers: {
      type: "array",
      defaultsTo: []
    },
    surveyId: {
      model: "surveys"
    },
    owner: {
      model: "users"
    }
  }
};
