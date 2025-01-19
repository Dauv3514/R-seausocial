import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    console.log("Token reçu:", token);  // Vérifie si le token est bien reçu
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            console.log("Erreur token:", err);  // Si l'erreur est dans la vérification du token
            return res.status(403).json("Token pas valide");
        }
        console.log("Utilisateur vérifié:", userInfo); 
        
        const q = userId 
        ? `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid) WHERE p.userId = ?`
        : `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)`;
        const values = userId ? [userId] : [userInfo.id, userInfo.id]
       
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Erreur requête SQL:", err);  // Affiche l'erreur SQL si elle se produit
                return res.status(500).json(err);
            }
            console.log("Résultats de la requête:", data);  // Vérifie les résultats retournés par la requête
            return res.status(200).json(data);
        });
    });
}

// const q = `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)`

// const q = `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
        // LEFT JOIN relationships AS r ON (p.userid = r.followedUserId) WHERE r.followerUserId= ? OR p.userid = ?`;

export const addPost = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) {
            return res.status(403).json("Token pas valide");
        }
        
        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`,`userId`) VALUES (?)";
        
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Erreur requête SQL:", err);  // Affiche l'erreur SQL si elle se produit
                return res.status(500).json(err);
            }
            console.log("Résultats de la requête:", data);  // Vérifie les résultats retournés par la requête
            return res.status(200).json("La publication a été crée");
        });
    });
}