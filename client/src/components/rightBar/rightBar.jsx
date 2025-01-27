import "./rightBar.scss"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

const rightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const queryClient = useQueryClient();

  // Fonction générique pour les requêtes useQuery
  const fetchData = (endpoint) =>
    useQuery({
      queryKey: [endpoint, userId],
      queryFn: () =>
        makeRequest.get(`/users/${userId}/${endpoint}`).then((res) => res.data),
    });

  // Obtenir les utilisateurs suivis et non suivis
  const { data: followed } = fetchData("followed");
  const { data: notFollowed } = fetchData("not-followed");

  // Mutation pour suivre un utilisateur
  const mutation = useMutation({
    mutationFn: (followerUserId) =>
      makeRequest.post("/relationships", { userId: followerUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notFollowed", userId]);
      queryClient.invalidateQueries(["followed", userId]);
    },
  });

  const handleFollow = (followerUserId) => mutation.mutate(followerUserId);
  const notFollow = (followerUserId) => console.log(followerUserId, `Utilisateur ignoré`);

  const { isLoading, error, data} = useQuery({
    queryKey: ["activities", userId],
    queryFn: () => makeRequest.get("/activities/" + userId).then((res) => res.data),
  });

  const messages = {
    like_post: 'a liké un nouveau post',
    has_published: 'a publié un nouveau post',
    follow_newUser: 'a suivi un nouvel utilisateur'
  };

  return (
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Pour vous</span>
            {notFollowed && notFollowed.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img
                  src={"/upload/"+user.profilePic}
                  alt=""
                />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>Suivre</button>
                <button onClick={() => notFollow(user.Id)}>Ignorer</button>
              </div>
            </div>
            ))}
          </div>
          <div className="item">
          <span>Mes dernières activités</span>
            {isLoading ? (
              <p>Chargement...</p>
            ) : error ? (
              <p>Erreur</p>
            ) : (
              data.map((activity) => (
                <div className="user" key={activity.id}>
                  <div className="userInfo">
                    <img src={"/upload/" + currentUser.profilePic} alt="" />
                    <p>
                      <span>{currentUser.username}</span>
                      {messages[activity.activities]}
                    </p>
                  </div>
                  <span>{moment(activity.createdAt).fromNow()}</span>
                </div>
              ))
            )}
          </div>
          <div className="item">
            <span>Amis en ligne</span>
            {followed && followed.map((user) => (
              <div className="user" key={user.id}>
              <div className="userInfo">
                <img
                  src={"/upload/"+user.profilePic}
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