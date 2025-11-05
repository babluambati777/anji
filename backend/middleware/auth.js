const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET || 'secret');
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET || 'secret');
    req.body.adminId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { authUser, authDoctor, authAdmin };
