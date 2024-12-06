const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // Eğer kullanıcı admin ise devam et
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  };
  
  module.exports = isAdmin;
  