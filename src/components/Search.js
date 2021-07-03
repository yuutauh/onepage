import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
	floatButton: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}))

const Search = (props) => {
	const classes = useStyles();
	const [display, setDisplay] = useState(false);
	const [options, setOptions] = useState([]);
	const [search, setSearch] = useState("");
	const [tagObj, setTagObj] = useState({})

	useEffect(() => {
		db.collection('tags').get().then((docs) => {
		const items = [];
		docs.forEach((doc) => {
			items.push(doc.data())
		})
		setOptions(items);
		})
	}, [])

	const setTag = (tag) => {
		setSearch(tag.name)
		setTagObj(tag)
		setDisplay(false)
	}


	const TagSearch = (e) => {
		setSearch(e.target.value)
		setDisplay(true)
	}

	const InputClick = (e) => {
		setDisplay(!display)
		
	} 

	console.log({options,search, tagObj})

 	return (
		<motion.div initial={{y: '100vh'}}
		animate={{y: 0}}
		exit={{y: '100vh'}}
		transition={{duration: 0.1, type: 'tween'}}
        >
		<div className="margin-top center">
			<div className="search-wraper">
				{tagObj.id === undefined ? (
					<IconButton>
					    <SearchIcon />
				    </IconButton>
				) : (
					<IconButton onClick={() => {props.history.push(`/tag/${tagObj.id}`)}}>
						<SearchIcon />
					</IconButton>
				)}
				<input 
				value={search}
				onClick={() => {setDisplay(!display)}}  
				placeholder="tagを検索"
				onChange={(e) => {TagSearch(e)}}
				className="margin-bottom search"
				/>
			</div>
			{display && (
				<>
				  {options.filter(({name}) => name.indexOf(search.toLowerCase()) > -1)
				  .map((option, i) => (
					  <div className="margin-bottom" key={i} onClick={() => {setTag(option)}}>
						  <span className="tag">{option.name}</span>
					  </div>
				  ))}
				</>
			)}
			<button onClick={() => {props.history.push("/usersearch")}}>userを検索</button>
			<Fab className={classes.floatButton} component="span" onClick={() => {props.history.goBack()}}>
			  <ArrowBackIcon />
			</Fab>
	    </div>
		</motion.div>
	)
}

export default Search
