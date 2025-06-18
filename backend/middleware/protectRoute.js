import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded?.id)
      return res.status(401).json({ message: 'Invalid or expired token.' });

    req.user = { id: decoded.id };
    next();
  });
};
