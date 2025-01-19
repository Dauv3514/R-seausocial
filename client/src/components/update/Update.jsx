import React from 'react'
import "./update.scss";
import { makeRequest } from "../../axios"
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const Update = ({setOpenUpdate, user}) => {

    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        name: "",
        city: "",
        website: "",
    });

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
      mutationFn: (user) => makeRequest.put("/users", newPost),
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    });
  
    const handleClick = async (e) => {
      e.preventDefault();
      let coverUrl = user.cover;
      let profileUrl = user.profilePic;
      coverUrl = cover && await upload(cover);
      profileUrl = cover && await upload(profile);


      mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
      setOpenUpdate(false);
    };

    return (
    <div className="update">
        <form>
            <input type="file" />
            <input type="file" />
            <input type="text" name="name" onChange={handleChange}/>
            <input type="text" name="city" onChange={handleChange}/>
            <input type="text" name="website" onChange={handleChange}/>
            <button onClick={handleClick}>Update</button>
        </form>
        <button onClick={()=>setOpenUpdate(false)}>X</button>
    </div>
  )
}
