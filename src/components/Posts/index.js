import React, { Component } from 'react';
import './Posts.css';
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
    Notification.requestPermission();

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

    this.posts_channel = this.props.pusher.subscribe('posts-channel');

    this.posts_channel.bind('new-post', data => {
      this.setState({ posts: this.state.posts.concat(data.post) });

      if (Notification.permission === 'granted') {
        try {
          let notification = new Notification(
            'Pusher Instagram Clone', 
            { 
              body: `New post from ${data.post.user.nickname}`, 
              icon: 'https://img.stackshare.io/service/115/Pusher_logo.png',
              image: `${data.post.image}`,
            });

          notification.onclick = function(event) {
            window.open('http://localhost:3000', '_blank');
          }
        } catch(e) {
          console.log('Error displaying notifications');
        }
      }
    }, this);

  }

  render() {
    return (
      <div>
        <div className="Posts">
          {
            this.state.posts
              .slice(0)
              .reverse()
              .map(
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
      </div>
    );
  }
}

export default Posts;
