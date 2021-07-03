import React from 'react';
import './App.css';
import { Switch, Route, useLocation } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from './styles/theme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import {AuthProvider} from './Auth/AuthProvider';
import CommentList from './components/CommentList';
import ThreadInput from './components/Input/ThreadInput';
import UserInput from './components/Input/UserInput';
import UserProfileEdit from './components/UserProfileEdit';
import Search from './components/Search';
import UserSearch from './components/UserSearch';
import TagThread from './components/TagThread';
import CommentListModal from './components/CommentListModal';
import { AnimatePresence } from 'framer-motion';
 

function App() {
  const location = useLocation();
  return (
    <>
          <CssBaseline />
            <AuthProvider>
              <MuiThemeProvider theme={theme}>
                  <Navbar />
                  <div className="navbar_h"></div>
      <AnimatePresence exitBeforeEnter>
                    <Switch location={location} key={location.pathname}>
                    <Route  exact path="/" component={Home} />
                    <Route path={"/login"} exact component={Login} />
                    <Route path={"/user/:user"} exact component={UserProfile} />
                    <Route path={"/comment/:comment"} exact component={CommentList} />
                    <Route path={"/input"} exact component={ThreadInput} />
                    <Route path={"/userinput"} exact component={UserInput} />
                    <Route path={"/user/:user/edit"} exact component={UserProfileEdit} />
                    <Route path={"/search"} exact component={Search} />
                    <Route path={"/usersearch"} exact component={UserSearch} />
                    <Route path={"/tag/:tag"} exact component={TagThread} />
                    <Route path={"/modal"} exact component={CommentListModal} />
                    </Switch>
      </AnimatePresence>
              </MuiThemeProvider>
            </AuthProvider>
    </>
  );
}

export default App;
