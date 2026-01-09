const { verifyToken } = require("../helpers/jwt");
const { Admin } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid token format' 
      });
    }

    const decoded = verifyToken(token);
    
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ 
        message: 'Admin not found' 
      });
    }
    
    req.user = { id: admin.id, email: admin.email };
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
};

module.exports = authentication;
