module.exports = {
  checkUser: function(userName) {
    const regexUser = /^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (userName.match(regexUser)) {
      return true;
    } else {
      return false;
    }
  },

  checkPassword: function(passWord) {
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
    if (passWord.match(regexPassword)) {
      return true;
    } else {
      return false;
    }
  },

  checkName: function(name) {
    const regexName =
      "^[^-s][a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
      "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
      "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
    if (name.match(regexName)) {
      return true;
    } else {
      return false;
    }
  }
};
