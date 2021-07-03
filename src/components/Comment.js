import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import {db} from '../firebase';
import { formatDistance, format } from 'date-fns'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import ColorizeIcon from '@material-ui/icons/Colorize';
import SendIcon from '@material-ui/icons/Send';
import firebase from "firebase/app";
import {AuthContext} from '../Auth/AuthProvider';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { toast } from 'react-toastify';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	commentheader: {
		display: 'flex',
		alignItems: "center",
	  },
	  commentImage: {
		width: '32px',
		aspectRatio: 'auto 32 / 32',
		height: '32px',
		borderRadius: '4px',
	  },
	  commentname: {
		display: 'inline-block',
		verticalAlign: 'middle',
		fontSize: '14px',
		lineHeight: '1.1',
		fontWeight: '400',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(5)
	  },
	  commenttime: {
		display: 'inline-block',
	  },
	  commentbody: {
		marginLeft: theme.spacing(6),
		marginBottom: theme.spacing(2),
		wordBreak: 'break-word',
	  },
	  commentlower: {
		display: 'flex',
		alignItems: "center",
		justifyContent: "center",
	  },
	  hitpoint: {
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		fontWeight: 'bold',
		width: 50,
		height: 50,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  blue: { 
		color: theme.palette.primary.blue
	  }
}))

const Comment = (props) => {
	const classes = useStyles();
	const currentUser  = useContext(AuthContext);
	const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";
	const [onFavirite, setOnFavorite] = useState(false);

	const onFavorites = (subId) => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = { favorites: [uid,...props.subThread.favorites]}
			db.collection('threads'). doc(props.thread.id)
			  .collection('subThreads').doc(subId).update(o)
			  .then(() => {console.log("onFavorite")})
			  toast('お気に入りにしました')
		}
	}

	const offFavorites = (subId) => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = props.subThread.favorites.filter((favorite) => favorite !== uid)
			const os = { favorites: o}
			db.collection('threads'). doc(props.thread.id)
			  .collection('subThreads').doc(subId).update(os)
			.then(() => {console.log("offFavorite")})
			toast('お気に入りを解除しました')
		}
	}

	useEffect(() => {
		if(uid !== "") {
			setOnFavorite(props.subThread.favorites.some((item) => item == uid));
		}
	}, [currentUser])

	return (
		<>
			<div className="flex margin-bottom">
			<Link to={`/user/${props.subThread.uid}`}
							      style={{textDecoration: 'none', color: 'inherit'}}
			>
				<img className="comment-avatar margin-min-right" alt="o" src={props.subThread.userImage} />
			</Link>
				<div className="flex-variable">
					<div className="align-items margin-bottom">
						<div className="word-wrap font">
							<Link to={`/user/${props.subThread.uid}`}
							      style={{textDecoration: 'none', color: 'inherit'}}
							>
							  {props.subThread.username}
							</Link>
						</div>
						<div className="flex-right">{formatDistanceToNow(props.subThread.create.toDate(), {locale: ja})}</div>
					</div>
					<div className="word-wrap" style={{color: props.subThread.color}}>
					{props.subThread.body}
					</div>
					{props.subThread.image.path  &&
					  <div className="center">
						 <img className="thread-image" alt="o" src={props.subThread.image.path} />
					  </div>
					}
					<div >
						{onFavirite ? (
									<IconButton onClick={() => offFavorites(props.subThread.id)}>
										< FavoriteIcon />
									</IconButton>
								) : (
									<IconButton onClick={() => onFavorites(props.subThread.id)}>
										< FavoriteBorderIcon />
									</IconButton>
						)}
					<span>{props.subThread.favorites.length}</span>
					</div>
				    <hr/>
				</div>
			</div>
		</>
	)
}

export default Comment;
