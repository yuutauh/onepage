import React,{ useState, useEffect, useContext, useRef} from 'react'
import { db, storage } from '../firebase';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { v4 as uuidv4 } from "uuid";
import {AuthContext} from '../Auth/AuthProvider';
import Comment from './Comment';
import { format } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import firebase from "firebase/app";
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import { toast } from 'react-toastify';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ja } from 'date-fns/locale';
import formatISO9075 from 'date-fns/formatISO9075';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ClearIcon from '@material-ui/icons/Clear';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { motion } from "framer-motion";
import { CompactPicker } from 'react-color';
import Tippy from '@tippyjs/react';
import { Link, useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: '0 auto',
      width: 'calc(100% - 2rem)',
      maxWidth: 800,
    },
    upper: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
    },
    avatarContainer: {
      marginBottom: 12,
    },
    avatar: {
      marginRight: 12,
      verticalAlign: 'middle',
      height: 16,
      aspectRatio: 'auto 16 / 16',
      width: 16,
      display :'inline-block'
    },
    username: {
      fontSize: 12,
      color: '#202124',
    },
    title: {
      fontWeight: 'bold',
      fontSize: '2.2rem',
      letterSpacing: '-0.05em',
      lineHeight: '1.3',
      wordBreak: 'break-word',
    },
    lower: {
      display: 'flex',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    img: {
      height: 96,
      width: 96,
      borderRadius: '10px',
      marginRight: theme.spacing(3),
      objectFit: 'contain',
    },
    body: {
      wordBreak: 'break-word',
      fontSize: 14 ,
    },
    textFeild: {
      marginTop: theme.spacing(2), 
      textAlign: 'center',
      marginBottom: theme.spacing(2),
    },
    blue: { 
      color: theme.palette.primary.blue
    },
    floatButton: {
      position: 'fixed',
          bottom: theme.spacing(5),
          right: theme.spacing(5),
    },
}))

toast.configure();

const CommentList = (props) => {
	const classes = useStyles();
	const [thread, setThread] = useState({});
  const [subThreads, setSubThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body,setBody] = useState("");
  const [file, setFile] = useState("");
	const [imagePreview, setImagePreview] = useState("");
  const [onFavorite, setOnFavorite] = useState(false);
	const [image, setImage] = useState({});
  const currentUser  = useContext(AuthContext);
  const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";
  const [modal, setModal] = useState(false);
  const [nicos, setNicos] = useState([]);
  const nicoEls = useRef([]);
  const containerEl = useRef(null);
  const [nicoWidth, setNicoWidth] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [tagLists, setTagLists] = useState([]); 
  const cs = [];

	useEffect(() => {
		db.collection('threads').doc(props.match.params.comment).get()
		  .then((doc) => {
			  setThread(doc.data())
        if(uid !== "") {
          const i = doc.data().favorites.some((item) => item === uid)
          setOnFavorite(i)
        }
        db.collection('tags').where('threadId', 'array-contains',doc.data().id)
          .get().then((docs) => {
            const items = [];
            docs.forEach((doc) => {
              items.push(doc.data())
            })
            setTagLists(items)
          })
        
        setLoading(false)
		})
    db.collection('threads').doc(props.match.params.comment)
      .collection('subThreads').get().then((docs) => {
        const items = []
        const bs = []
        docs.forEach((doc) => {
          items.push(doc.data())
          const o = {
            body: doc.data().body,
            color: doc.data().color
          }
          bs.push(o)
        })
        setSubThreads(items)
        setNicos(bs)
    })
	}, []);
  
  const addSub = () => {
    if(uid !== "") {
      const uid = currentUser.currentUser.uid;
      const userImage = currentUser.currentUser.photoURL;
      const username = currentUser.currentUser.displayName;
      const id = uuidv4();
      const o = {
        id,
        uid,
        username,
        userImage,
        body,
        image,
        create: firebase.firestore.Timestamp.now(),
        favorites: [],
        color: selectedColor
      }

      db.collection('threads').doc(props.match.params.comment)
        .collection('subThreads').doc(id).set(o)
  
      db.collection('threads').doc(props.match.params.comment).update({
        subThreads: firebase.firestore.FieldValue.arrayUnion(id)
      })

      toast('返信を投稿しました')
      setBody("")
    } else {
      toast('ログインしてね')
    }
  }

  const deleteThread = () => {
    if(window.confirm('本当に削除しますか？'))
    db.collection('threads').doc(props.match.params.comment).delete();
    if(tagLists !== []) {
      tagLists.forEach((tagList) => {
        const newItems = tagList.threadId.filter(docs => docs !== props.match.params.comment)
         db.collection('tags').doc(tagList.id).update({
           threadId: newItems
         }).then(() => {
           toast('削除しました')
           props.history.goBack()
          })
      })
    }
  }

  const displayImage = (e) => {
    if(uid !== "") {
      e.preventDefault()
      let reader = new FileReader()
      let file = e.target.files[0];
      reader.onloadend = () => {
        setFile(file);
        setImagePreview(reader.result);
      }   
      reader.readAsDataURL(file)
    } else {
      toast('ログインしてね')
    }
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
    if(uid !== "") {
      displayImage(e);
      addStorage(e)
    } else {
      toast('ログインしてね')
    }
	}

  const onFavorites = () => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = { favorites: [uid,...thread.favorites]}
			db.collection('threads'). doc(props.match.params.comment).update(o)
			  .then(() => {console.log("onFavorite")})
			  toast('お気に入りにしました')
		}
	}

  const offFavorites = () => {
		if(uid === "") {
			toast('ログインしてね')
		} else {
			const o = thread.favorites.filter((favorite) => favorite !== uid)
			const os = { favorites: o}
			db.collection('threads'). doc(props.match.params.comment).update(os)
			  .then(() => {console.log("onFavorite")})
			  toast('お気に入りを解除しました')
		}
	}

  const addToRefs = (el) => {
		if(el && !nicoEls.current.includes(el)){
			cs.push(- (el.offsetWidth + 30))
      setNicoWidth(cs)
		}
	} 

    function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	return (
    <>
      {!loading &&
      <motion.div initial={{x: '100vw'}}
                  animate={{x: 0}}
                  exit={{x: '-100vw'}}
                  transition={{duration: 0.1, type: 'tween'}}
      >
        <div className="commentList" ref={containerEl}>
          <div className="align-items">
            <Link to={`/user/${thread.uid}`}>
              <Avatar className="thread-avatar margin-right margin-bottom margin-top" alt="Remy Sharp" src={thread.userImage} />
            </Link>
              <span className="thread-username margin-botttom word-wrap">
                <Link to={`/user/${thread.uid}`} 
                style={{textDecoration: 'none', color: 'inherit'}}>
                  {thread.username}
                </Link>
              </span>
          </div>
          <div className="commentList-body margin-bottom word-wrap">{thread.body}</div>        
          {thread.image.path && 
              <img className="commentList-image margin-bottom" alt="o" src={thread.image.path} />
          }
            {tagLists.map((tag, i) => (
              <>
                <div key={i} className="newtag margin-right">
                  <Link to={`/tag/${tag.id}`} style={{textDecoration: 'none', color: 'inherit'}} >
                    {tag.name}
                  </Link>
                </div>
              </>
            ))}
          <div className="align-items">
            <div className="margin-right">{formatISO9075(thread.create.toDate())}</div>
            <div>{formatDistanceToNow(thread.create.toDate(), {locale: ja})}前</div>
          </div>
          <hr />
          <div className="align-items">
            {onFavorite ? (
              <IconButton>
                < FavoriteIcon onClick={() => offFavorites()} />
              </IconButton>
            ) : (
              <IconButton>
                < FavoriteBorderIcon onClick={() => onFavorites()} />
              </IconButton>
            )}
            <span style={{marginRight: '1rem'}}>{thread.favorites.length}件のお気に入り</span>
            {uid === "" ? (
              <IconButton >
                <ChatBubbleOutlineIcon onClick={() => toast('ログインして返信しよう')} />
              </IconButton>
            ) : (
              <IconButton >
                <ChatBubbleOutlineIcon onClick={() => setModal(!modal)} />
              </IconButton>
            )}
			      <span>{thread.subThreads.length}件の返信</span>
            {currentUser && uid == thread.uid && (
              <div className="flex-right">
                <IconButton onClick={deleteThread}>
                  <ClearIcon /> 
                </IconButton>
              </div>
            )}
          </div>
          <hr />
          {subThreads.map((subThread, i) => (
            <Comment key={i}  threadId={props.match.params.comment} subThread={subThread}
                     thread={thread} onFavorite={onFavorite}
            />
          ))}
          {nicos.map((p,i) => (
          <motion.div 
                  key={i}
                  className="nico-nico"
	                ref={addToRefs}
				          style={{
							    top: getRandomArbitrary(30, 400),
                  color: p.color
						      }}
					        initial={{
								    x: document.body.offsetWidth
							    }}
                  animate={{
                     x: nicoWidth[i] 
                  }}
							    transition={{
										duration: 5,
                    delay: [i] * 1 
									}} 
				  >{p.body}</motion.div>
          ))}
        </div>
        {currentUser.currentUser !==null && 
          <Modal
            open={modal}
            onClose={() => {setModal(false)}}
          > 
            <motion.div 
              className="commentList-input-modal flex"
            >
              <div className="margin-right">
                <Avatar alt="Remy Sharp"
                className="thread-avatar" src={currentUser.currentUser.photoURL} />
              </div>
              <div className="flex-variable">
                <div className="font margin-bottom margin-top">{currentUser.currentUser.displayName}
                </div>
                <div>
                <input
                placeholder="返信をかく" 
                className="commentList-input" 
                onChange={(e) => {setBody(e.target.value)}} />
                </div>
            <IconButton color="primary" aria-label="upload picture" component="span">
                <label> 
                  <WallpaperIcon />
                  <input style={{display: 'none'}} type="file" id="image" onChange={(e) => {o(e)}} />
                </label>
            </IconButton>
            <span>画像を選択する（なくても可）</span>
                {imagePreview && (
                    <img style={{width: '100%',
                    height: '200px',
                    objectFit: 'contain'}} src={imagePreview} alt="o" /> 
                )}
                <div>
                 <Tippy interactive={true}  placement={"bottom"} content={
                 <CompactPicker
                color={selectedColor} 
                onChangeComplete={color => setSelectedColor(color.hex)}
                 />
                }>
                <IconButton>
                  <ColorLensIcon />
                </IconButton>
                </Tippy>
                <span>色を選択する</span>
                <div>
               <button onClick={(e) => {addSub(e)}}>送信する</button>
                </div>
               </div>
              </div>
            </motion.div>
          </Modal>
        }
        <Fab className={classes.floatButton} 
             onClick={() => {props.history.goBack()}}>
            
			   <ArrowBackIcon />
		  	</Fab>
     </motion.div>
       }
    </>
  )
}

export default CommentList
