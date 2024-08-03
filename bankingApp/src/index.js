import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Ensure this matches your server's URL
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
