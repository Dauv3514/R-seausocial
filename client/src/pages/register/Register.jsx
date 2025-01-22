import { useState } from "react";
import "./register.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const register = () => {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: ""
  })

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      // setError(err.response ? err.response.data : "Une erreur s'est produite");
      setErr(err.response.data);
      console.log(err.response);
    }
  };

  console.log(inputs, 'testeee');
  return (
    <div className="register">
        <div className="card">
            <div className="left">
                <h1> Bienvenue </h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus fugiat, quis perferendis qui sapiente tempore quae veniam dignissimos quia neque! Incidunt quaerat nobis fugit reprehenderit corporis laudantium veritatis! At, vel.
                </p>
                <span> Est-ce que tu as un compte ?</span>
                <Link to="/login">
                  <button>Se connecter</button>
                </Link>
            </div>
            <div className="right">
                <h1> S'inscrire </h1>
                <form>
                  <input type="text" placeholder="Nom d'utilisateur" name="username" onChange={handleChange}/>
                  <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                  <input type="password" placeholder="Mot de passe" name="password" onChange={handleChange}/>
                  <input type="text" placeholder="Nom" name="name" onChange={handleChange}/>
                  {err && err}
                  <button onClick={handleClick}> Inscription </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default register