import React, {useContext, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core';
import { db, storage } from '../../firebase';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import {AuthContext} from '../../Auth/AuthProvider';
import LinkIcon from '@material-ui/icons/Link';
import { v4 as uuidv4 } from "uuid";

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
		width: '100%',
		height: '120px',
		objectFit: 'contain'
	},
	marginRight: {
		marginRight: theme.spacing(2)
	},
	width :{
		width: '100%'
	}
}))

const UserInput = () => {
	const classes = useStyles();
	const currentUser  = useContext(AuthContext);
	const uid = currentUser.currentUser.uid;
	const [file, setFile] = useState("");
	const [imagePreview, setImagePreview] = useState("");
	const [image, setImage] = useState({});
	const [fireUser, setFireUser] = useState({});
	const [profile, setProfile] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
		db.collection('users').doc(uid).get()
		  .then((doc) => {
			  const item = doc.data(); 
			  setFireUser(item);
		  })
	}, []);

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

	const updateUser = () => {
		const updateUser = {
			dbImage: image,
			profile,
			url
		} 
		db.collection('users').doc(uid).update(updateUser)
		  .then(() => {console.log('userUpdate!')})
	}
	
    console.log(url);

	return (
		<div>
			<div className={classes.root}>
				<div className={classes.flex}>
					<div className={classes.avatar}>
						<Avatar alt="Remy Sharp" src={currentUser.currentUser.photoURL} />
					</div>
					<div className={classes.inputarea}>
						<p>{currentUser.currentUser.displayName}</p>
						<div className={classes.alignItems}>
							<IconButton　color="primary">
							   <label>
									<WallpaperIcon />
									<input className={classes.displayNone} type="file" id="image"
									       onChange={(e) => {o(e)}}
									/>
								</label>
							</IconButton>
							<div>バック画像を設定する（なくても可）</div>
						</div>
                        {imagePreview && (
							<img className={classes.img} src={imagePreview} alt="o" /> 
						)}
						<TextField
							id="standard-multiline-static"
							label="プロフィール"
							multiline
							rows={4}
							className={classes.width}
							onChange={(e) => {setProfile(e.target.value)}}
						/>
						<div className={classes.alignItems}>
							<div className={classes.marginRight}><LinkIcon /></div>
							<TextField
								id="standard-multiline-static"
								label="urlがあれば（なくても可）"
								rows={1}
								className={classes.width}
								onChange={(e) => {setUrl(e.target.value)}}
							/>
						</div>
						<div className={classes.alignItems}>
							<label htmlFor="icon-button-file"> 
								<IconButton color="primary" aria-label="upload picture" component="span" onClick={() => {updateUser()}} >
									<CheckRoundedIcon />
								</IconButton>
							</label>
							<span>送信する</span>
						</div>
					</div>
				</div>
			</div>
			<Fab className={classes.floatButton} color="primary">
			   <ArrowBackIcon />
			</Fab>	
		</div>
	)
}

export default UserInput;
