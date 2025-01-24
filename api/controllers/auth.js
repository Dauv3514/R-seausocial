import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Utilisateur existe déjà");

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

        // Mettre à jour isOnline à 1 pour cet utilisateur
        const updateOnline= "UPDATE users SET isOnline = 1 WHERE id = ?";
        db.query(updateOnline, [data[0].id], () => {
            // Si tout va bien, envoyer le cookie et la réponse
            res.cookie("jwt", token, {
                httpOnly: true,
            }).status(200).json(others);
        });
    });
}


export const logout = (req, res) => {
    // Récupérer le token JWT du cookie
    const token = req.cookies.jwt;

    // Si pas de token, pas d'utilisateur connecté
    if (!token) {
        return res.status(401).json("Utilisateur non authentifié.");
    }

    jwt.verify(token, "secretkey", (err, data) => {
        if (err) {
            return res.status(403).json("Token invalide.");
        }

        // Récupérer l'ID de l'utilisateur depuis le token
        const userId = data.id;

        // Mettre à jour la base de données pour définir isOnline à 0
        const updateOnline = "UPDATE users SET isOnline = 0 WHERE id = ?";
        db.query(updateOnline, [userId], (updateErr) => {
            if (updateErr) {
                return res.status(500).json("Erreur lors de la mise à jour de l'état en ligne.");
            }

            // Supprimer le cookie JWT
            res.clearCookie("jwt", {
                secure: true,
                sameSite: "none",
            }).status(200).json("Déconnexion réussie.");
        });
    });
};