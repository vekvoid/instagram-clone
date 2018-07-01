import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Posts.css';
import gql from 'graphql-tag';
import Post from '../Post';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    Notification.requestPermission();
    const { apolloClient, pusher } = this.props;
    const { state } = this;

    apolloClient
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
      `,
      })
      .then((response) => {
        this.setState({ posts: response.data.posts });
      });

    this.posts_channel = pusher.subscribe('posts-channel');

    this.posts_channel.bind('new-post', (data) => {
      this.setState({ posts: state.posts.concat(data.post) });

      if (Notification.permission === 'granted') {
        try {
          const notification = new Notification(
            'Pusher Instagram Clone',
            {
              body: `New post from ${data.post.user.nickname}`,
              icon: 'https://img.stackshare.io/service/115/Pusher_logo.png',
              image: `${data.post.image}`,
            },
          );

          notification.onclick = function openHomePage() {
            window.open('http://localhost:3000', '_blank');
          };
        } catch (e) {
          /* eslint no-console: ["error", { allow: ["error"] }] */
          console.error('Error displaying notifications');
        }
      }
    }, this);
  }

  render() {
    const { state } = this;

    return (
      <div>
        <div className="Posts">
          {
            state.posts
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
                ),
              )
          }
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  apolloClient: PropTypes.element.isRequired,
  pusher: PropTypes.element.isRequired,
};

export default Posts;
