let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");
let Pusher = require("pusher");
let bodyParser = require("body-parser");
let Multipart = require("connect-multiparty");

let schema = buildSchema(`
  type User {
    id : String!
    nickname : String!
    avatar : String!
  }
  type Post {
      id: String!
      user: User!
      caption : String!
      image : String!
  }
  type Query{
    user(id: String) : User!
    post(user_id: String, post_id: String) : Post!
    posts(user_id: String) : [Post]
  }
`);

let userslist = {
  a: {
    id: "a",
    nickname: "Chris",
    avatar: "https://www.laravelnigeria.com/img/chris.jpg"
  },
  b: {
    id: "b",
    nickname: "OG",
    avatar:
      "http://res.cloudinary.com/og-tech/image/upload/q_40/v1506850315/contact_tzltnn.jpg"
  }
};

let postslist = {
  a: {
    a: {
      id: "a",
      user: userslist["a"],
      caption: "Moving the community!",
      image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
    },
    b: {
      id: "b",
      user: userslist["a"],
      caption: "Angular Book :)",
      image:
        "https://cdn-images-1.medium.com/max/1000/1*ltLfTw87lE-Dqt-BKNdj1A.jpeg"
    },
    c: {
      id: "c",
      user: userslist["a"],
      caption: "Me at Frontstack.io",
      image: "https://pbs.twimg.com/media/DNNhrp6W0AAbk7Y.jpg:large"
    },
    d: {
      id: "d",
      user: userslist["a"],
      caption: "Moving the community!",
      image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
    }
  }
};

let root = {
  user: function({ id }) {
    return userslist[id];
  },
  post: function({ user_id , post_id }) {
    return postslist[user_id][post_id];
  },
  posts: function({ user_id }){
    return Object.values(postslist[user_id]);
  }
};

// Pusher client config
let pusher = new Pusher({
  appId: '551412',
  key: 'dbcc6e1ed5742c308d14',
  secret: 'dd501051d7c90c9b037c',
  cluster: 'eu',
  encrypted: true
});

// Create Express App
let app = express();

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

let multipartMiddleware = new Multipart();

// Trigger add a new post 
app.post('/newpost', multipartMiddleware, (req,res) => {
  // Create a sample post
  let post = {
    user : {
      nickname : req.body.name,
      avatar : req.body.avatar
    },
    image : req.body.image,
    caption : req.body.caption
  }

  // trigger pusher event 
  pusher.trigger("posts-channel", "new-post", { 
    post 
  });

  return res.json({status : "Post created"});
});

app.listen(4000);