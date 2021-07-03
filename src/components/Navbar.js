import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import {Link} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {AuthContext} from '../Auth/AuthProvider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import SearchIcon from '@material-ui/icons/Search';
import {auth} from '../firebase';
import '../App.css';
import Logo from '../styles/cogicogi.svg';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    flexShrink: 0, 
    backgroundColor: '#f3e8d0',
		color: '#926704',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    border: '2px solid black'
  }
}));

const logoAnimation =  {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },

}

const NavBar = (props) => {
  const currentUser  = useContext(AuthContext);
  const classes = useStyles();

  return (
          <div className={classes.root}>
            <AppBar position="fixed" color="inherit">
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  App
                </Typography>
                <IconButton>
                  <Link to={'/search'}>
                    <SearchIcon />
                  </Link>
                </IconButton>
                {currentUser.currentUser !== null ?  (
                  <>
                    <Link to={`/user/${currentUser.currentUser.uid}`}>
                      <Avatar alt="userAvatar" src={currentUser.currentUser.photoURL} />
                    </Link>
                    <IconButton component="span" onClick={() => {auth.signOut()}}>
                      <ExitToAppIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton component="span" >
                      <Link to={'/login'}>
                        <AccountCircleOutlinedIcon />
                      </Link>
                  </IconButton>
                )
                }
              </Toolbar>
            </AppBar>
          </div>
  );
}

export default NavBar;