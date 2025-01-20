import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import 'moment/locale/fr';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

moment.locale('fr'); 

const Post = ({ post }) => {
  console.log("post est bien appelé");
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const { isLoading, error, data} = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => { 
      if(liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => { 
      return makeRequest.delete("/posts/"+ postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id))
  }

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).locale('fr').fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)}/>
          {menuOpen && post.userid === currentUser.id && (<button onClick={handleDelete}>delete</button>)}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/"+post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? "loading" : Array.isArray(data) && data.includes(currentUser.id) ? 
            <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike}/>
            : <FavoriteBorderOutlinedIcon onClick={handleLike}/>
            }
            {Array.isArray(data) ? data.length : 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Commentaires
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Partager
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;