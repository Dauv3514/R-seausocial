import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from "moment";

const Comments = (postId) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const fetchComments = async () => {
    const { data } = await makeRequest.get('comments');
    return data;
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["comments?postId=" + postId],
    queryFn: fetchComments,
  });;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    mutation.mutate({ desc, postId });
    setDesc("");
    setFile(null);
  };
  
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input 
          type="text" 
          placeholder="Ecrire un commentaire"
          value={desc}
          onChange={e=>setDesc(e.target.value)} 
        />
        <button onClick={handleClick}>Envoyer</button>
      </div>
      {isLoading ? "Loading" 
      : data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).locale('fr').fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;