
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getRelationships = (req, res) => {
    console.log('La fonction getRelationships est appelée');
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
    
    db.query(q, [req.query.followedUserId], (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship=> relationship.followerUserId));
    });
}

export const addRelationship = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
        const values = [
          userInfo.id,
          req.body.userId
        ];
    
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Suivi ave succès");
        });
    
    });
}

export const deleteRelationship = (req, res) => {

    const token = req.cookies.jwt;
    if (!token) return res.status(401).json("Tu n'es pas connecté!");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token pas valide !");
    
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
    
        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Unfollow");
        });
});
}