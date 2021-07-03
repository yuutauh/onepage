import React, {useCallback, useContext, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import {AuthContext} from '../../Auth/AuthProvider';
import { db, storage} from '../../firebase';
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
	root: {
		color: '#926704',
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(2),
	},
	flex: {
		display: 'flex',
	},
	alignItems: {
		display: 'flex',
		alignItems: "center",
	},
	avatar: {
		paddingTop: theme.spacing(1),
		marginRight: theme.spacing(2)
	},
	inputarea: {
		paddingTop: theme.spacing(1),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	space: {
		height: 40,
	},
	floatButton: {
		position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
	},
	displayNone: {
		display : 'none',
	},
	img: {
		height: 96,
		width: 96,
		borderRadius: '10px',
		objectFit: "contain"
	},
}))

const Input = (props) => {
	const classes = useStyles();
	const currentUser  = useContext(AuthContext);
	const [body, setBody] = useState("");
	const [file, setFile] = useState("");
	const [imagePreview, setImagePreview] = useState("");
	const [image, setImage] = useState({});
	const [tags, setTags] = useState([]);
	const [tagLists, setTagLists] = useState([]);
	const [onTags, setOnTags] = useState([]);
    const TagsRef = db.collection('tags');
	const [toggle, setToggle] = useState(true);
	const [search, setSearch] = useState("");
	const [display, setDisplay] = useState(false);

	useEffect(() => {
		TagsRef.get().then((docs) => {
		const items = [];
		docs.forEach((doc) => {
			items.push({data: doc.data(), toggle: toggle})
		})
		setTagLists(items);
		})
	}, [])

	const displayImage = (e) => {
		e.preventDefault()
		let reader = new FileReader()
		let file = e.target.files[0];
		reader.onloadend = () => {
		  setFile(file);
		  setImagePreview(reader.result);
		}   
		reader.readAsDataURL(file)
	}
	
	const addStorage = (e) => {
		const files = e.target.files;
		let blob = new Blob(files, { type: "image/jpeg"});
		const imageId = uuidv4();
		const ref = storage.ref('images').child(imageId);
		const task = ref.put(blob);
		task.then(() => {
			task.snapshot.ref.getDownloadURL().then((url) => {
				const newImage = {id: imageId, path: url};
                setImage(newImage);
			})
		})
	}

	const o = (e) => {
		displayImage(e);
		addStorage(e)
	}

	const addThread = (e) => {
		const uid = currentUser.currentUser.uid;
		const userImage = currentUser.currentUser.photoURL;
		const username = currentUser.currentUser.displayName;
		const id = uuidv4();
		const tagId = uuidv4();
        const addThread = {
			id,
			body,
			uid,
			userImage,
			username,
			image,
			create: firebase.firestore.FieldValue.serverTimestamp(),
			favorites: [],
			subThreads: [],
		}
		db.collection('threads').doc(id).set(addThread);

		tags.forEach((doc) => {
			db.collection('tags').doc(tagId).set({
				name: doc,
			    id: tagId,
				threadId: firebase.firestore.FieldValue.arrayUnion(id),
				userId: []
			})
		})

		onTags.forEach((doc) => {
			db.collection('tags').doc(doc).update({
				threadId: firebase.firestore.FieldValue.arrayUnion(id)
			})
		})
		toast('投稿しました')
		props.history.push('/')
	}

	const inputBody = useCallback((e) => {
		setBody(e.target.value)
	}, [setBody]);

	const inputTags = (tags) => {
		setTags(tags)
	}
 
	// const toggleTag = (tag) => {
	// 	setOnTags(prev => [...prev,tag.id])
	// 	setToggle(false)
	// }

	const toggleTag = (tag) => {
		tag.toggle = false
		setOnTags(prev => [...prev, tag.data.id])
	}
 
	const offtoggleTag = (tag) => {
		tag.toggle = true
		setOnTags(onTags.filter(onTag => onTag !== tag.data.id))
	}

	const TagSearch = (e) => {
		setSearch(e.target.value)
		setDisplay(true)
	}

	return (
		<motion.div initial={{y: '100vh'}}
		            animate={{y: 0}}
					exit={{y: '100vh'}}
					transition={{duration: 0.1, type: 'tween'}}
		>
		<div className="form-container flex">
			<div className="margin-right">
				<Avatar alt="Remy Sharp"
				className="thread-avatar" src={currentUser.currentUser.photoURL} />
			</div>
			<div className="flex-variable">
				<div className="font margin-bottom margin-top">{currentUser.currentUser.displayName}</div>
				<div className="textarea-container">
					<textarea 
					    className="textarea"
						placeholder="なにか"
						onChange={inputBody}
					/>
					{imagePreview && ( <img className="textarea-image" src={imagePreview} alt="o" /> )}
				</div>
				<IconButton aria-label="upload picture" component="span">
						<label> 
							<WallpaperIcon />
							<input className={classes.displayNone} type="file" id="image" onChange={(e) => {o(e)}}
							/>
						</label>
			   </IconButton>
				<span>画像を追加する</span>
			<div className="margin-bottom">
				<div className="font">tagをつくる</div>
				<TagsInput  value={tags} onChange={inputTags}  /> 
			</div>
			<div className="margin-bottom">
			<div className="font">既存のtagから選択する</div>
				{tagLists && tagLists.map((tag, i) => (
								<>
								{tag.toggle ? (
									<div className="newtag margin-right" onClick={() => {toggleTag(tag)}}>
										{tag.data.name}
									</div>
								) : (
									<div className="selected-tag margin-right" onClick={() => {offtoggleTag(tag)}}>
										{tag.data.name}
									</div>
								)}
								</>
				))}
			</div>
			<div className="margin-bottom">
            <div className="font">tagを検索する</div>
			<input
			  value={search.name}
			  onClick={() => {setDisplay(!display)}}
			  placeholder="tagを検索する"
			  onChange={TagSearch}
			/>
			{display && (
				<>
				  {tagLists.filter(({data}) =>
				  data.name.indexOf(search.toLocaleLowerCase()) > -1)
				  .map((option, i) => (
					  <>
					   {option.toggle ? (
						   <div onClick={() => toggleTag(option)}>
							   {option.data.name}
						   </div>
					   ) : (
						   <div onClick={() => offtoggleTag(option)}
						   style={{color: 'red'}} 
						   >
							   {option.data.name}
						   </div>
					   )}
					  </>
				  ))
				  }
				</>
			)}
			</div>
			<label htmlFor="icon-button-file"> 
				<IconButton color="primary" aria-label="upload picture" component="span" onClick={(e) => {addThread(e)}}>
					<CheckRoundedIcon />
				</IconButton>
			</label>		
			</div>	
			<Fab className={classes.floatButton}  component="span"
			     onClick={() => {props.history.push('/')}}
			>
			   <ArrowBackIcon />
			</Fab>
		</div>
		</motion.div>
	)
}

export default Input;