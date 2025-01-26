import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  console.log(userId, 'testions');
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json("Tu n'es pas connecté!");
    const userId = req.params.userId;
    console.log(userId, 'testions');
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token non valide!");
  
      const q =
        "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";
  
      db.query(
        q,
        [
          req.body.name,
          req.body.city,
          req.body.website,
          req.body.coverPic,
          req.body.profilePic,
          userInfo.id,
        ],
        (err, data) => {
          if (err) res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Mis a jour!");
          return res.status(403).json("Vous ne pouvez mettre à jour que votre post!");
        }
      );
    });
  
};

export const getUsersNotFollowedByUser = (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json("Tu n'es pas connecté!");
    const userId = req.params.userId;

    const q =
        ` SELECT users.id, users.profilePic, users.name
          FROM users
          LEFT JOIN relationships 
          ON users.id = relationships.followedUserId 
          AND relationships.followerUserId = ?
          WHERE relationships.followedUserId IS NULL
          AND users.id != ?`;

    db.query(q,[userId, userId], (err, data) => {
        if (err) res.status(500).json(err);
        return res.status(200).json(data);
        }
    );
};

export const getUsersFollowedByUser = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json("Tu n'es pas connecté!");
  const userId = req.params.userId;

  const q =
      ` SELECT users.id, users.profilePic, users.name
        FROM users
        LEFT JOIN relationships 
        ON users.id = relationships.followedUserId
        WHERE relationships.followedUserId
        AND users.id != ?
        AND users.isOnline = 1`;

  db.query(q,[userId, userId], (err, data) => {
      if (err) res.status(500).json(err);
      console.log(data, 'rezrzeff')
      return res.status(200).json(data);
      }
  );
};
