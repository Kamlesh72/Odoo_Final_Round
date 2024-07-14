const rbacMiddleware = (acceptedRoles) => {
  return (req, res, next) => {
    try {
      if (!acceptedRoles.includes(req.body.role)) {
        res.status(403).json({
          success: false,
          message: 'Access denied: Insufficient role',
          data: null,
        });
        return;
      }

      next();
    } catch (err) {
      res.send({
        success: false,
        message: err.message,
      });
    }
  };
};

export default authMiddleware;
