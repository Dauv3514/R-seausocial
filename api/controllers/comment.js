import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
    const q = `
        SELECT c.*, u.id AS userid, u.name, u.profilePic
        FROM comments AS c
        JOIN users AS u ON (u.id = c.commentUserid)
        WHERE c.postid = ?
        ORDER BY c.createdAt DESC;
    `;
    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
}

export const addComment = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        
        const q = "INSERT INTO comments (`desc`, `commentUserid`, `createdAt`, `postid`) VALUES (?)";
        
        const values = [
            req.body.desc,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.postId
        ];

        console.log(values, 'valeurs');
        
        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            console.log("Données insérées:", data);
            return res.status(200).json("Le commentaire a été crée");
        });
    });
}