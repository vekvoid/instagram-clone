import React, { Component } from 'react';
import './Posts.css';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Post from '../Post';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    this.props.apollo_client
      .query({
        query: gql`
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
      `})
      .then(response => {
        this.setState({ posts: response.data.posts });
      });

    this.posts_channel = this.props.pusher.subscribe('post-channel');

    this.posts_channel.bind('new-post', data => {
      this.setState({ posts: this.state.posts.concat(data.post) });
    }, this);
  }

  render() {
    return (
      <div className="Posts">
        {
          this.state.posts.map(
            post => (
              <Post 
                avatar={post.user.avatar} 
                caption={post.caption} 
                image={post.image} 
                key={post.id}
                nickname={post.user.nickname}
              />
            ))
        }
      </div>
    );
  }
}

export default Posts;
