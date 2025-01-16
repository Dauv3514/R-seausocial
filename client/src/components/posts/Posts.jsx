import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import './posts.scss';
import Post from '../post/Post';

const fetchPosts = async () => {
  const { data } = await makeRequest.get('posts');
  return data;
};

const Posts = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  console.log(data, 'ok');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;