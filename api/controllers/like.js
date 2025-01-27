
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLikes = (req, res) => {
    const q = "SELECT userId FROM likes WHERE postId = ?";
    
    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            console.log("Erreur requête SQL:", err);
            return res.status(500).json(err);
        }
        console.log("Résultats de la requête:", data);
        return res.status(200).json(data.map(like=> like.userId));
    });
}

export const addLike = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if (err) return res.status(403).json("Token pas valide");

        const userid = userInfo.id;
        const postid = req.body.postId;

        // 1. Insérer le like dans la table `likes`
        const likeQuery = "INSERT INTO likes (`userid`, `postid`) VALUES (?)";
        const likeValues = [userid, postid];

        // 2. Ajouter une activité dans la table `activities`

        db.query(likeQuery, [likeValues], (err, data) => {
            if (err) return res.status(500).json(err);

            const activityQuery = "INSERT INTO activities (`user_id`, `activities`, `createdAt`) VALUES (?, ?, ?)";
            const activityValues = [userid, 'like_post', moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")];

            db.query(activityQuery, activityValues, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Le post a été liké et l'activité ajoutée.");
            });
        });
    
    });
}

export const deleteLike = (req, res) => {

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