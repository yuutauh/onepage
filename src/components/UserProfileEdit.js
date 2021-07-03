import React, {useEffect, useState, useContext} from 'react';
import {db} from '../firebase';
import { AuthContext } from '.././Auth/AuthProvider';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	floatButton: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}))

const UserProfileEdit = (props) => {
	const classes = useStyles();
	const currentUser  = useContext(AuthContext);
	const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";
	const [profile, setProfile] = useState("");
	const [tagLists, setTagLists] = useState([]);
	const [onTags, setOnTags] = useState([]);
	const [search, setSearch] = useState("");
	const [tagObj, setTagObj] = useState({});
	const [display, setDisplay] = useState(false);

	useEffect(() => {
		db.collection('tags').get().then((docs) => {
		const items = [];
		docs.forEach((doc) => {
			items.push({data: doc.data(), toggle: true})
		})
		setTagLists(items);
		})
	}, [])

	const toggleTag = (tag) => {
		tag.toggle = false
		setOnTags(prev => [...prev, tag.data.id])
	}
 
	const offtoggleTag = (tag) => {
		tag.toggle = true
		setOnTags(onTags.filter(onTag => onTag !== tag.data.id))
	}

	const setTag = (tag) => {
		setSearch(tag.name)
		setTagObj(tag)
		setDisplay(false)
	}

	const TagSearch = (e) => {
		setSearch(e.target.value)
		setDisplay(true)
	}

	const editUserProfile = (e) => {
		const editProfile = {
			profile: profile,
		}
		db.collection('users').doc(uid).set(editProfile, { merge: true })

		onTags.forEach((doc) => {
			db.collection('tags').doc(doc).update({
				userId: firebase.firestore.FieldValue.arrayUnion(uid)
			})
		})
        toast('プロフィールを編集しました')
	}

	return (
		<motion.div initial={{y: '100vh'}}
					animate={{y: 0}}
					exit={{y: '100vh'}}
					transition={{duration: 0.1, type: 'tween'}}
		>
			<div className="form-container flex margin-top">
			    <div className="margin-right">
				<Avatar alt="Remy Sharp"
				className="thread-avatar" src={currentUser.currentUser.photoURL} />
			    </div>
				<div className="flex-variable">
			    	<div className="font margin-bottom margin-top">{currentUser.currentUser.displayName}</div>
				    <input type="text" value={profile}  onChange={(e) => {setProfile(e.target.value)}} />
			    <p>よく使うtag</p>
            {tagLists && tagLists.map((tag, i)  => (
				<>
				  {tag.toggle ? (
					<p key={i} onClick={() => {toggleTag(tag)}}>
						{tag.data.name}
					</p>
				  ) : (
					  <p key={i} style={{backgroundColor: 'royalblue'}} onClick={() => {offtoggleTag(tag)}}>
						  {tag.data.name}
					</p>
				  )}
				</>
			))}
			<div>
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
				value={search.name}
				onClick={() => {setDisplay(!display)}}  
				placeholder="tagを検索"
				onChange={(e) => {TagSearch(e)}}
				className="margin-bottom search"
				/>
			</div>
			{display && (
				<>
				  {tagLists.filter(({data}) => data.name.indexOf(search.toLowerCase()) > -1)
				  .map((option, i) => (
					  <>
					    {option.toggle ? (
						<div onClick={() => toggleTag(option)}>
							{option.data.name}
						</div>
						) : (
						<div onClick={() => offtoggleTag(option)}
						   style={{backgroundColor: 'royalblue'}}>
							   {option.data.name}
						 </div>
						)}
					  </>
				  ))}
				</>
			)}
			<div>
				<Link to={`/user/${uid}`}>
				<button onClick={(e) => {editUserProfile(e)}}>toukou</button>
				</Link>
			</div>
			</div>
			</div>
			<Fab className={classes.floatButton} component="span" onClick={() => {props.history.goBack()}}>
			  <ArrowBackIcon />
			</Fab>
		</motion.div>
	)
}

export default UserProfileEdit;