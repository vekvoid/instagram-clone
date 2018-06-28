import React from 'react';
import './Posts.css';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Post from '../Post';

const Posts = () => {
  return (
    <Query
      query={gql`
        {
          posts(user_id: "a"){
            id
            user{
              nickname
              avatar
            }
            image
            caption
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading Posts...</p>;
        if (error) return <p>Error Fetching Posts.</p>;

        let posts = data.posts;

        return (<div className="Posts">
          {
            posts.map(
              post => <Post 
                        avatar={post.user.avatar} 
                        caption={post.caption} 
                        image={post.image} 
                        key={post.id}
                        nickname={post.user.nickname} />
            )
          }
        </div>);
      }}
    </Query>
  );
};

export default Posts;
