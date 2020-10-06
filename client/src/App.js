import React from 'react';
import './App.css';
import Tag from './Tag';
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  return (
    <Router>
      <QueryScreen />
    </Router>
  );
}

function QueryScreen() {
  let query = useQuery()
  return (
    <Router>
        <Switch>
          <Route children={<Home token={query.get("token")} />} />
          <Route children={<Login path="/login" />} />
        </Switch>
    </Router>
  );
}

function Home({ token }) {
  if (token) localStorage.setItem('token', token)
  let localToken = localStorage.getItem('token')
  if (localToken) {
    return (
      <Tag />
    );
  } else {
    return Login()
  }
}

function Login() {
  return (
    <div>
      <div>
        <header>
          <a href="https://github.com/login/oauth/authorize?client_id=1844df0635b9d9710d9f&scope=repo">
            Sign in with Github
          </a>
        </header>
      </div>
    </div>
  )
}

export default App;
