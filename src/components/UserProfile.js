import React, {useEffect, useState, useContext} from 'react';
import { db } from '../firebase';
import { makeStyles } from '@material-ui/core';
import { AuthContext } from '.././Auth/AuthProvider';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Thread from './Thread';
import Sky from '../styles/pexels-pixabay-314726.jpg';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';
import FavoritesLists from './FavoritesList';
import { toast } from 'react-toastify';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
	position: {
		position: 'relative'
	},
	headerImage: {
		zIndex: '-1',
		position: 'absoute',
		width: '100%',
		height: '150px',
		objectFit: 'cover',
	},
	userImage: {
		position: 'absolute',
		bottom: '-30%',
		left: '5%',
		borderRadius: '50%',
		border: '3px solid white ' ,
		width: '70px',
		height: '70px'
	},
	usersection: {
		margin: '0 7% 0 7%',
	},
	followbutton: {
		width: '100%',
		height: '50px',
		display: 'flex',
		justifyContent: 'flex-end' ,
		alignItems: 'center'
	},
	profile: {
		overflowWrap: 'break-word',
		marginBottom: theme.spacing(2)
	},
	urlicon: {
		display: 'flex',
		fontWeight: '400',
        fontSize: '15px',
		alignItems: 'center'
	},
	followNembar: {
		fontSize: 15,
		fontWeight: '600',
	},
	followArea: {
		marginBottom: theme.spacing(4),
		display: 'flex',
	},
	floatButton: {
		position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
	},
}))

const UserProfile = (props) => {
	const [thread, setThread] = useState(true);
	const [Profile, setProfile] = useState({});
	const [threads, setThreads] = useState([]);
	const [tagLists, setTagLists] = useState([]);
	const classes = useStyles();
    const currentUser  = useContext(AuthContext);
	const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";
	const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);
	const [friends, setFriends] = useState([]);
	const [FollowingFriends, setFollowingFriends] = useState([]);
	const [userfollow , setUserfollow] = useState(false);
	const [open, setOpen] = useState(false);
	const [subOpen, setSubOpen] = useState(false);
	const [FavoritesList, setFavoritesList] = useState(false);
	const [index, setIndex] = useState(0);
	

	useEffect(() => {
		db.collection('users').doc(props.match.params.user).get()
		  .then((doc) => {
            setProfile(doc.data())
		})

		db.collection('threads').where('uid', '==', props.match.params.user)
		  .get().then((snapshots) => {
			  const items = [];
			  snapshots.forEach((doc) => {
				  items.push(doc.data())
			  })
			setThreads(items);
		})

		db.collection('tags').where('userId', 'array-contains', props.match.params.user)
		  .get().then((snapshots) => {
			  const items = [];
			  snapshots.forEach((doc) => {
				  items.push(doc.data())
			  })
			setTagLists(items);
		})

		db.collection('follows').where('followed_uid', '==', props.match.params.user)
		  .onSnapshot((snapshots) => {
			  const items = [];
			  snapshots.forEach((doc) => {
				  items.push(doc.data())
			  })
			setFollower(items.length)
			setFriends(items);
		})

		db.collection('follows').where('following_uid', '==', props.match.params.user)
		  .onSnapshot((snapshots) => {
			  const items = [];
			  snapshots.forEach((doc) => {
				  items.push(doc.data())
			  })
			setFollowingFriends(items)
			setFollowing(items.length);
		})
		setUserfollow(friends.some((item) => item.following_uid == uid))
		setOpen(false)
		setSubOpen(false)
	}, [props.match.params.user]);

	useEffect(() => {
		setUserfollow(friends.some((item) => item.following_uid == uid))
	}, [friends])

	const unfollow = () => {
		db.collection('follows').where('followed_uid', '==', props.match.params.user)
		  .get().then((docs) => {
			  const item = "";
              docs.forEach((doc) => {
				  const item = doc.id
				  db.collection('follows').doc(item).delete()
				    .then(() => {console.log("delete!")})
			  })
		})
	}

	const follow = () => {
		if(uid !== "") {
			db.collection('follows').add({
				followed_uid: props.match.params.user,
				following_uid: uid
			}).then(() => {console.log("complete!")})
		} else {
            toast('ログインしてフォローしよう')
		}
	}

	const show = () => {
		return (
			<>
			{userfollow ? (
				<Button style={{margin: '30px 30px 0 0 '}} variant="outlined" color="primary"
				        component="span" onClick={() => {unfollow()}}
				>
					　フォロー解除
				</Button>
			) : (
				<Button style={{margin: '30px 30px 0 0 '}} variant="contained" color="primary"
				        component="span" onClick={() => {follow()}}
				>
					　フォローする
				</Button>
			)}
			</>
		)
	}

	const handleChange = (e, v) => {
		setIndex(v)
	} 

	const handleChangeIndex = (index) => {
		setIndex(index)
	}

	console.log(tagLists)

	return (
		<div>
			<div>
               <div className={classes.position}>
				    {Profile.dbImage && Profile.dbImage.path !== "" ? (
						<img src={Profile.dbImage.path} className={classes.headerImage} />
					) : (
                        <img src={Sky} className={classes.headerImage} />
					)}				
					<img className={classes.userImage} src={Profile.photo} />
			   </div>
			<div className={classes.followbutton}>
				{props.match.params.user == uid ? (
				  <Button style={{margin: '30px 30px 0 0 '}} 
				          variant="outlined" color="primary"
						  onClick={() => {props.history.push(`/user/${props.match.params.user}/edit`)}}
				  >
					　プロフィール設定
				  </Button>
				) : (
				  <>
				    {show()}
				  </>
				)}
			</div>
			<div className={classes.usersection}>
				<div className={classes.username}>
					<div style={{fontWeight: 'bold'}}>{Profile.username}</div>
				</div>
				<div className={classes.profile}>
					{Profile.profile}
				</div>
				<div className="margin-bottom">
					{tagLists && tagLists.map((tag,i) => (
						<div key={i} className="newtag margin-right">
							<Link to={`/tag/${tag.id}`} style={{textDecoration: 'none', color: 'inherit'}} >
							{tag.name}
							</Link>
						</div>
					))}
			    </div>
				<div className={classes.followArea}>
					<div onClick={() => {setSubOpen(!subOpen)}}>
						<span className={classes.followNembar}>{following}</span>
						<span style={{marginRight: '10px'}}>フォロー</span>
					</div>
				    <div onClick={() => {setOpen(!open)}}>
						<span className={classes.followNembar}>{follower}</span>
						<span>フォロワー</span>
					</div>
				</div>
				{open && (
					<>
					  <FollowerList friends={friends} />
					</>
				)}
				{subOpen && (
					<>
					  <FollowingList FollowingFriends={FollowingFriends} />
					</>
				)}	
				<Tabs className="margin-bottom" value={index} onChange={handleChange}>
					<Tab label="thread" />
					<Tab label="いいね" />
				</Tabs>
				<SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
					<div>
					   {threads.map((thread, i) => (
							<div>
								<Thread key={i} thread={thread}/>
							</div>
						))}
					</div>
					<div>
					  <FavoritesLists id={props.match.params.user}/>
					</div>
				</SwipeableViews>
			</div>
		</div>
		<Fab className={classes.floatButton} color="primary" component="span"
			     onClick={() => {props.history.push('/')}}
		>
			 <ArrowBackIcon />
		</Fab>
		</div>
	)
}

export default UserProfile;
