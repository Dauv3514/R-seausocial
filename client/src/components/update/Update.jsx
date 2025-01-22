import React from 'react'
import "./update.scss";
import { makeRequest } from "../../axios"
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const Update = ({setOpenUpdate, user}) => {

    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);

    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
    };

    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: (user) => makeRequest.put("/users", user),
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    });

    // const { currentUser } = useContext(AuthContext);

    // console.log(user, 'quuuo');
    // console.log(currentUser.id, 'quuuo2');

    const [texts, setTexts] = useState({
        name: "",
        city: "",
        website: "",
    });
  
    const handleClick = async (e) => {
      e.preventDefault();
      let coverUrl;
      let profileUrl;
      coverUrl = cover ? await upload(cover) : user.coverPic;
      profileUrl = cover ? await upload(profile) : user.profilePic;

      const updatedUser = { ...texts, coverPic: coverUrl, profilePic: profileUrl };
      mutation.mutate(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setOpenUpdate(false);
    };

    return (
    <div className="update">
        <div className="wrapper">
            <h1>Mets a jour ton profil</h1>
            <form>
                <div className="files">
                    <input type="file" id="cover" onChange={e=>setCover(e.target.files[0])}/>
                    <input type="file" id="profile" onChange={e=>setProfile(e.target.files[0])}/>
                    <input type="text" name="name" onChange={handleChange}/>
                    <input type="text" name="city" onChange={handleChange}/>
                    <input type="text" name="website" onChange={handleChange}/>
                    <button onClick={handleClick}>Update</button>
                </div>   
            </form>
            <button className="close" onClick={()=>setOpenUpdate(false)}>X</button>
        </div>
    </div>
  )
}


