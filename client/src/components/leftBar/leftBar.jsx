import "./leftBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Watch from "../../assets/4.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";

const leftBar = () => {

  const {currentUser} = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img            
              alt=""
              src={"/upload/"+ currentUser.profilePic}
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Amis</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groupes</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>A regarder</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Vos raccourcis</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Evénements</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallerie</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
      </div>
    </div>
  )
}

export default leftBar