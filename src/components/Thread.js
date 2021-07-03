import React, { useEffect, useState, useContext } from 'react';
import {db} from '../firebase';
import { AuthContext } from '.././Auth/AuthProvider';
import Avatar from '@material-ui/core/Avatar';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';	
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale';	
import Modal from '@material-ui/core/Modal';

const Thread = (props) => {
	const currentUser  = useContext(AuthContext);
	const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";
	const [onFavirite, setOnFavorite] = useState(false);
	const [tagLists, setTagLists] = useState([]); 
	const [modal, setModal] = useState(false);

	useEffect(() => {
		db.collection('tags').where('threadId', 'array-contains', props.thread.id).get()
		  .then((docs) => {
			  const items = []
			  docs.forEach((doc) => {
				  items.push(doc.data())
			  })
			setTagLists(items)
		})
	}, [])

	useEffect(() => {
		if(uid !== "") {
			setOnFavorite(props.thread.favorites.some((item) => item == uid));
		}
	}, [currentUser])
	
	const onFavorites = () => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = { favorites: [uid,...props.thread.favorites]}
			db.collection('threads'). doc(props.thread.id).update(o)
			  .then(() => {console.log("onFavorite")})
			  toast('お気に入りにしました')
		}
	}

	const offFavorites = () => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = props.thread.favorites.filter((favorite) => favorite !== uid)
			const os = { favorites: o}
			db.collection('threads'). doc(props.thread.id).update(os)
			  .then(() => {console.log("onFavorite")})
			  toast('お気に入りを解除しました')
		}
	}

	console.log(props)

	return (
		<>
		<Link className="thread-container" to={`/comment/${props.thread.id}`}
		      style={{textDecoration: 'none', color: 'inherit'}} 
		>
			<Link to={`/user/${props.thread.uid}`}
							      style={{textDecoration: 'none', color: 'inherit'}}
							>
			    <Avatar className="thread-avatar margin-right" alt="Remy Sharp" src={props.thread.userImage} />
			</Link>
			<div className="flex-variable">
				<div className="align-items">
					<Link to={`/user/${props.thread.uid}`}  style={{textDecoration: 'none', color: 'inherit'}}>
						<div className="thread-username margin-bottom word-wrap">
						{props.thread.username}
						</div>
					</Link>
					<div className="flex-right">
						{props.thread.create !== null && 
							<>
							{formatDistanceToNow(props.thread.create.toDate(), {locale: ja})}
							</>
						}
					</div>
			    </div>
			<div className="margin-bottom">
				{tagLists && tagLists.map((tag,i) => (
					<>
					<span key={i} className="newtag margin-right">
						<Link to={`/tag/${tag.id}`} style={{textDecoration: 'none', color: 'inherit'}} >
						  {tag.name}
						</Link>
					</span>
					</>
				))}
			</div>
			<div className="word-wrap body-font">
				{props.thread.body}
			</div>
			{props.thread.image.path  &&
			    <Link to={"/"} style={{textDecoration: 'none', color: 'inherit'}}>
					<div className="center" onClick={() => {setModal(true)}}>
					  <img className="thread-image" alt="o" src={props.thread.image.path} />
					</div>
				</Link>
			}
			{onFavirite ? (
				<IconButton onClick={() => offFavorites()}>
					< FavoriteIcon />
				</IconButton>
			) : (
				<IconButton onClick={() => {onFavorites()}}>
					< FavoriteBorderIcon />
				</IconButton>
			)}
			<span style={{marginRight: '1rem'}}>{props.thread.favorites.length}</span>
				<IconButton>
					<ChatBubbleOutlineIcon />
				</IconButton>
			<span>{props.thread.subThreads.length}</span>
			<hr />
		</div>
		</Link>
		<Modal open={modal}
		       onClose={() => {setModal(false)}}
		>   
		<div className="thread-image-detail-container">
			<div style={{backgroundImage: `url(${props.thread.image.path})`}}
			     className="thread-image-detail" 
			></div>
		</div>
		</Modal>
		</>
	)
}

export default Thread;