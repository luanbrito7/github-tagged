import React from 'react';
import logo from './logo.svg';
import api from './api';
import './App.css';
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
  let localToken = localStorage.getItem('token')
  if (token) {
    localStorage.setItem('token', token)
    api.get("/").then(res => console.log(res), err => console.log(err))
    return (
      <div>
        Welcome
      </div>
    );
  } else if (localToken) {
    return (
      <div>
        Welcome w localToken
      </div>
    );
  }
  else {
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
