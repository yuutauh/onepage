import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import {Link} from 'react-router-dom';

const FollowerList = (props) => {
	const [Fusers, setFUsers] = useState([]);

	useEffect(() => {
		props.FollowingFriends.forEach((doc) => {
			const items = [];
			db.collection('users').doc(doc.followed_uid).get()
			  .then((item) => {
               items.push(item.data());
			   setFUsers(items);
			})
		})
	}, [props.FollowingFriends])
	
	return (
		<div>
			<div style={{fontWeight: 'bold'}}>フォロー中</div>
			<List>
				{Fusers.map(fuser => (
					<Link to={`/user/${fuser.uid}`} 
					style={{textDecoration: 'none', color: 'inherit'}}
			        >
						<ListItem>
							<ListItemIcon>
								<Avatar src={fuser.photo} />
							</ListItemIcon>
							<ListItemText primary={fuser.username} />
						</ListItem>
					</Link>
				))}
			</List>
		</div>
	)
}

export default FollowerList;
