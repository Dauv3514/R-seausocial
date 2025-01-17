import { db } from "../connect.js";

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