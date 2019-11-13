
module.exports = {
  attributes: {
    id: {
      primaryKey: true,
      type: "integer",
      autoIncrement: true
    },
    contentSurvey: {
      type: "string"
    },
    options: {
      collection: "options",
      via: "surveyId"
    },
    owner: {
      model: "users"
    }
  }
};
