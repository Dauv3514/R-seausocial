import "./rightBar.scss"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const rightBar = () => {

  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;
  
  const queryClient = useQueryClient();

  const { data, isError, rIsLoading } = useQuery({
    queryKey: ['notFollowed', userId],
    queryFn: 
    () => makeRequest.get("/" + userId + "/not-followed").then((res)=>{
      return res.data;
    })
  });

  const { data : followed } = useQuery({
    queryKey: ['followed', userId],
    queryFn: 
    () => makeRequest.get("/" + userId + "/followed").then((res)=>{
      return res.data;
    })
  });

  console.log(followed, 'okokok');

  const followerUserId = Array.isArray(data) && data.length > 0 ? data[0].id : null;
  console.log(followerUserId);
  const { data: relationshipData } = useQuery({
    queryKey: ["relationshipp", followerUserId],
    queryFn: () =>
      makeRequest.get(`/relationships?followerUserId=${followerUserId}`).then((res) => res.data),
  });

  console.log(data, 'gggg111');  // Data des utilisateurs
  console.log(relationshipData, 'gggg222');  // Data des relations

  const mutation = useMutation({
    mutationFn: () => {
      return makeRequest.post("/relationships", {userId});
    },
    onSuccess: () => {
      // Rafraîchir les données des relations après la mutation
      queryClient.invalidateQueries(["relationshipp"]);
    },
  });
  
  const handleFollow = () => {
    // Exécute la mutation en envoyant l'ID de l'utilisateur à suivre
    mutation.mutate(relationshipData.includes(currentUser.id))
  };

    // const mutation = useMutation({
  //   mutationFn: () => { 
  //     return makeRequest.post("/relationships", { userId });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["user"]);
  //   },
  // });

  console.log(data, 'cetsok2');


  return (
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Pour vous</span>
            {data && data.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img
                  src={user.profilePic}
                  alt=""
                />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button onClick={handleFollow}>Suivre</button>
                <button>Ignorer</button>
              </div>
            </div>
            ))}
          </div>
          <div className="item">
            <span>Mes dernières activités</span>
            <div className="user">
              <div className="userInfo">
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>
                  <span>Valentin Dauvier</span> a changé sa photo de couverture
                </p>
              </div>
              <span>Il y a 1 min</span>
            </div>
            <div className="user">
              <div className="userInfo">
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>
                  <span>Valentin Dauvier</span> a liké un post
                </p>
              </div>
              <span>Il y a 1 min</span>
            </div>
            <div className="user">
              <div className="userInfo">
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>
                  <span>Valentin Dauvier</span> a publié
                </p>
              </div>
              <span>Il y a 1 min</span>
            </div>
          </div>
          <div className="item">
            <span>Amis en ligne</span>
            {followed && followed.map((user) => (
              <div className="user" key={user.id}>
              <div className="userInfo">
                <img
                  src={user.profilePic}
                  alt=""
                />
                <div className="online" />
                  <span>{user.name}</span>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default rightBar