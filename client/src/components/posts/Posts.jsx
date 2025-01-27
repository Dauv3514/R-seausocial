import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import './posts.scss';
import Post from '../post/Post';

const Posts = ({userId}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: 
    () => makeRequest.get("/posts?userId="+userId).then((res)=>{
      return res.data;
    })
  });

  return (
    <div className="posts">
      {error
        ? "Quelquechose ne va pas!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
};

export default Posts;