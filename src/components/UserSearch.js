import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
	floatButton: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}))

const UserSearch = (props) => {
	const classes = useStyles();
	const [display, setDisplay] = useState(false);
	const [options, setOptions] = useState([]);
	const [search, setSearch] = useState("");
	const [userObj, setUserObj] = useState({});

	useEffect(() => {
		db.collection('users').get().then((docs) => {
		const items = [];
		docs.forEach((doc) => {
			items.push(doc.data())
		})
		setOptions(items);
		})
	}, [])

	const setUser = (user) => {
		setSearch(user.username)
		setUserObj(user)
		setDisplay(false)
	}


	const UserSearch = (e) => {
		setSearch(e.target.value)
		setDisplay(true)
	}

	console.log(options)

	return (
		<motion.div initial={{y: '100vh'}}
		            animate={{y: 0}}
					exit={{y: '100vh'}}
					transition={{duration: 0.1, type: 'tween'}}
		>
		<div className="margin-top center">
			<div className="search-wraper">
			    <IconButton onClick={() => {props.history.push(`/user/${userObj.id}`)}}>
					<SearchIcon />
				</IconButton>
			<input 
			  value={search}
              onClick={() => {setDisplay(!display)}}  
			  placeholder="userを検索"
			  onChange={(e) => {UserSearch(e)}}
			  className="margin-bottom search"
			/>
			</div>
			{display && (
				<>
				  {options.filter(({username}) => username.indexOf(search.toLowerCase()) > -1)
				  .map((option, i) => (
					  <div key={i} onClick={() => {setUser(option.username)}}>
						  <p>{option.username}</p>
					  </div>
				  ))}
				</>
			)}
			<button onClick={() => {props.history.push("/search")}}>tagを検索</button>
			<Fab className={classes.floatButton} component="span" onClick={() => {props.history.goBack()}}>
			  <ArrowBackIcon />
			</Fab>
		</div>
		</motion.div>
	)
}

export default UserSearch
