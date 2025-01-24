import "./rightBar.scss"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

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

  // Obtenez les utilisateurs suivis et non suivis
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


  return (
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Pour vous</span>
            {notFollowed && notFollowed.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img
                  src={user.profilePic}
                  alt=""
                />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>Suivre</button>
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