import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Valentin Dauvier",
      img: "https://images.pexels.com/photos/139162/pexels-photo-139162.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "Valentin Dauvier",
      img: "https://images.pexels.com/photos/139132/pexels-photo-139132.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 3,
      name: "Valentin Dauvier",
      img: "https://images.pexels.com/photos/139134/pexels-photo-139134.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 4,
      name: "Valentin Dauvier",
      img: "https://images.pexels.com/photos/13913477/pexels-photo-13913477.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
          <img src={"/upload/"+currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <button>+</button>
      </div>
      {stories.map(story=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories