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
    description: {
      type: "string"
    },
    closedAt: {
      type: "datetime"
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
