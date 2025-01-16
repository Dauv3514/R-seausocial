import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Utilisateur existe");

        // CREATE A NEW USER
        // HASH THE PASSWORD
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Définition de la requête SQL pour insérer un nouvel utilisateur
        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
        // Définition des valeurs à insérer
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name
        ];

        // Exécution de la requête SQL
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Utilisateur bien créé");
        });
    });
};

export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ?";
    // Exécution de la requête SQL
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("Aucun utilisateur trouvé")

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkPassword) return res.status(401).json("Mauvais mot de passe")

        const token = jwt.sign({id:data[0].id}, "secretkey")
        const {password, ...others} = data[0];
        res.cookie("jwt", token, {
            httpOnly: true,
        }).status(200).json(others)
    });
}


export const logout = (req, res) => {
    res.clearCookie("jwt",{
        secure:true,
        sameSite:"none"
    }).status(200).json("Déconnexion réussie")
    
}