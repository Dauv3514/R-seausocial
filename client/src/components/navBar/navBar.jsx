import "./navBar.scss";
import { useContext } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios"
import { useLocation } from "react-router-dom";

const Navbar = () => {

  const {toggle, darkMode} = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext);
  // const userId =  currentUser?.id;

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["user", userId],
  //   queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => res.data),
  //   enabled: !!userId,
  // });

  // if (error) {
  //   console.log("Error:", error);
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Social/Valentin</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img
            alt=""
            src={"/upload/"+ currentUser.profilePic}
          />
          <span> {currentUser.name} </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;