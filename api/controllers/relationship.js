
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getRelationships = (req, res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
    
    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            console.log("Erreur requête SQL:", err);  // Affiche l'erreur SQL si elle se produit
            return res.status(500).json(err);
        }
        console.log("Résultats de la requête:", data);  // Vérifie les résultats retournés par la requête
        return res.status(200).json(data.map(relationship=> relationship.userId));
    });
}

export const addRelationship = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
        const values = [
          userInfo.id,
          req.body.postId
        ];
    
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Le post a été liké.");
        });
    
    });
}

export const deleteRelationship = (req, res) => {

    const token = req.cookies.jwt;
    if (!token) return res.status(401).json("Tu n'es pas connecté!");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token pas valide !");
    
        const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    
        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Le post a été disliké");
        });
});
}