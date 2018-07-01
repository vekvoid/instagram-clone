import React from 'react';
import PropTypes from 'prop-types';
import './Post.css';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  render() {
    const {
      nickname,
      avatar,
      image,
      caption,
    } = this.props;

    return (
      <article className="Post" ref={this.myRef}>
        <header>
          <div className="Post-user">
            <div className="Post-user-avatar">
              <img src={avatar} alt={nickname} />
            </div>
            <div className="Post-user-nickname">
              <span>
                {nickname}
              </span>
            </div>
          </div>
        </header>
        <div className="Post-image">
          <div className="Post-image-bg">
            <img alt={caption} src={image} />
          </div>
        </div>
        <div className="Post-caption">
          <strong>
            {nickname}
          </strong>
          {caption}
        </div>
      </article>
    );
  }
}

Post.propTypes = {
  nickname: PropTypes.string,
  avatar: PropTypes.string,
  image: PropTypes.string,
  caption: PropTypes.string,
};

Post.defaultProps = {
  nickname: 'stranger',
  avatar: '',
  image: '',
  caption: '',
};

export default Post;
