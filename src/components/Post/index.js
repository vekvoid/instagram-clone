import React from 'react';
import './Post.css';

class Post extends React.Component {
  render() {
    const nickname = this.props.nickname,
          avatar = this.props.avatar,
          image = this.props.image,
          caption = this.props.caption;

          console.log(nickname);
    return (
      <article className="Post" ref="Post">
        <header>
          <div className="Post-user">
            <div className="Post-user-avatar">
              <img src={avatar} alt={nickname} />
            </div>
            <div className="Post-user-nickname">
              <span>{nickname}</span>
            </div>
          </div>
        </header>
        <div className="Post-image">
          <div className="Post-image-bg">
            <img alt={caption} src={image} />
          </div>
        </div>
        <div className="Post-caption">
          <strong>{nickname}</strong> {caption}
        </div>
      </article>
    );
  }
}

export default Post;