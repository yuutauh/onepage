import React, {useEffect, useState, useContext} from 'react';
import {db} from '../firebase';
import Thread from './Thread';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
	floatButton: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}))

const TagThread = (props) => {
	const classes = useStyles();
	const [tag, setTag] = useState({});
	const [tagThreads, setThreads] = useState([]);
	const [tagUsers, setTagUsers] = useState([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		db.collection('tags').doc(props.match.params.tag).get()
		  .then((doc) => {
			  setTag(doc.data())
			  const items = [];
			  doc.data().threadId.forEach((id) => {
				  db.collection('threads').doc(id).get()
				    .then((doc) => {
						items.push(doc.data())
						setThreads(items)
					})    
			  })
			  const os = [];
			  doc.data().userId.forEach((id) => {
				  db.collection('users').doc(id).get()
				    .then((doc) => {
						os.push(doc.data())
						setTagUsers(os)
					})    
			  })
		})
	}, [props.match.params.tag])

	const TagThreadShow = () => {
		if(tagThreads !== []){
			return(
				tagThreads.map((thread, i) => (
					<Thread  key={i} thread={thread} />
				))
			)
		}
	}

	const TagUserShow = () => {
		return(
			tagUsers.map((user,i) => (
				<div className="margin-top margin-left margin-right">
					<Link to={`/user/${user.uid}`} 
                          style={{textDecoration: 'none', color: 'inherit'}}
					>
						<div className="align-items">
							<img src={user.photo} alt="o" className="comment-avatar margin-right" />
							<div>{user.username}</div>
						</div>
					</Link>
					<div className="hr"></div>
				</div>
		    ))
		)
	}

	const handleChange = (e, v) => {
		setIndex(v)
	} 

	const handleChangeIndex = (index) => {
		setIndex(index)
	}

	return (
		<div>
			<div className="center margin-bottom margin-top">
				<div className="newtag">{tag.name}</div>
			</div>
			<Tabs className="margin-bottom" value={index} onChange={handleChange}>
				<Tab label="thread" />
				<Tab label="tag" />
			</Tabs>
			<SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
				<div>{TagThreadShow()}</div>
				<div>
					{TagUserShow()}
				</div>
			</SwipeableViews>
			<Fab className={classes.floatButton} component="span" onClick={() => {props.history.goBack()}}>
			  <ArrowBackIcon />
			</Fab>
		</div>
	)
}

export default TagThread
