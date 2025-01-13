import "./register.scss";
import { Link } from "react-router-dom";

const register = () => {
  return (
    <div className="register">
        <div className="card">
            <div className="left">
                <h1> Bienvenue </h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus fugiat, quis perferendis qui sapiente tempore quae veniam dignissimos quia neque! Incidunt quaerat nobis fugit reprehenderit corporis laudantium veritatis! At, vel.
                </p>
                <span> Est-ce que tu as un compte ?</span>
                <button> S'inscrire </button>
            </div>
            <div className="right">
                <h1> S'inscrire </h1>
                <form>
                  <input type="text" placeholder="Nom d'utilisateur" />
                  <input type="email" placeholder="Email" />
                  <input type="password" placeholder="Mot de passe" />
                  <input type="text" placeholder="Nom" />
                  <Link to="/login">
                      <button type="submit"> Connexion </button>
                  </Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default register