import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import {Link} from 'react-router-dom';

const FollowerList = (props) => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const items = [];
		props.friends.forEach((doc) => {
			db.collection('users').doc(doc.following_uid).get()
			  .then((item) => {
               items.push(item.data());
			   setUsers(items);
			})
		})
	}, [props.friends])
	
	return (
		<div>
			<div style={{fontWeight: 'bold'}}>フォロワー</div>
			<List>
				{users && users.map(user => (
					<Link to={`/user/${user.uid}`} 
					style={{textDecoration: 'none', color: 'inherit'}}
			        >
						<ListItem>
							<ListItemIcon>
								<Avatar src={user.photo} />
							</ListItemIcon>
							<ListItemText primary={user.username} />
						</ListItem>
					</Link>
				))}
			</List>
		</div>
	)
}

export default FollowerList;
