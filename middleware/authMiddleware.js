const jwt = require('jsonwebtoken');
const User = require('../models/User');
//---------
const TokenBlacklist = require('../models/TokenBlacklist');
//----------


//-----------old--------------
// const auth = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   console.log("Token received:", token); // For debugging, consider removing in production

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     if (!req.user) {
//       return res.status(401).json({ message: 'User not found' });
//     }
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized', error: error.message });
//   }
// };
//-------------old end----------------

//-----------------
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has been invalidated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};
//----------------------------

module.exports = auth;
