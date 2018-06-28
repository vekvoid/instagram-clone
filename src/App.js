import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Pusher from 'pusher-js';

import Header from './components/Header';
import Posts from './components/Posts';

const client = new ApolloClient({
  uri : "http://localhost:4000/graphql"
})

class App extends Component {
  constructor() {
    super();

    this.pusher = new Pusher('dbcc6e1ed5742c308d14', {
      cluster: 'eu',
      encrypted: true
    });
  }

  render () {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Header />
          <section className="App-main">
            <Posts pusher={this.pusher} apollo_client={client} />
          </section>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
