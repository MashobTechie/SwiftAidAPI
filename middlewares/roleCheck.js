const authorizeResponder = (req, res, next) => {
    if (req.user.role !== "responder") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
  
  module.exports = authorizeResponder;
    