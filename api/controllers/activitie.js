
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getActivities = (req, res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json("Tu n'es pas connecté!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=>{

        const q = "SELECT user_id, activities, createdAt FROM activities WHERE user_id = ?";
        
        db.query(q, [userInfo.id], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data);
        });
    });
}
