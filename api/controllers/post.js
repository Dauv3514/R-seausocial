import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token pas valide");
        
        const q =
        userId !== "undefined"
          ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
          : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
            LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
            ORDER BY p.createdAt DESC`;
        const values = userId!== "undefined" ? [userId] : [userInfo.id, userInfo.id]
       
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Erreur requête SQL:", err);
                return res.status(500).json(err);
            }
            console.log("Résultats de la requête:", data);
            return res.status(200).json(data);
        });
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        
        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`,`userId`) VALUES (?)";
        
        const userid = userInfo.id;
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userid
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Erreur requête SQL:", err);
                return res.status(500).json(err);
            }
            
            const activityQuery = "INSERT INTO activities (`user_id`, `activities`, `createdAt`) VALUES (?, ?, ?)";
            const activityValues = [userid, 'has_published', moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")];

            db.query(activityQuery, activityValues, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                console.log("Résultats de la requête:", data);
                return res.status(200).json("La publication a été crée et l'activité ajoutée.");
            });
        });
    });
}

export const deletePost = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        
        const q ="DELETE FROM posts WHERE `id`=? AND `userId` = ?";
        
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ];
        
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
            return res.status(403).json("You can delete only your post")
        });
    });
}