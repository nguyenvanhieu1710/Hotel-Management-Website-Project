import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const checkPermission = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(403).send("No token provided");
      return;
    }
    // console.log(token);
    // console.log(process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = decoded.email;
    if (!user) {
      res.status(403).send("Unauthorized");
      return;
    }
    if (user.role !== "admin") {
      res.status(403).send("Unauthorized");
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};

export default checkPermission;
