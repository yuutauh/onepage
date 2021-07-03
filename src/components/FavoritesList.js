import React, {useEffect, useState, useContext} from 'react';
import {db} from '../firebase';
import Thread from './Thread';

const FavoritesList = (props) => {
	const [lists, setLists] = useState([]);

	useEffect(() => {
		db.collection('threads').where('favorites', 'array-contains', props.id).get()
		  .then((docs) => {
			  const items = [];
			  docs.forEach((doc) => {
				  items.push(doc.data())
			  });
			setLists(items);
		  })
	}, [props.id])

	return (
		<div>
			{lists.map((list, i) => (
				<div>
					<Thread key={i} thread={list}/>
				</div>
			))}
		</div>
	)
}

export default FavoritesList
