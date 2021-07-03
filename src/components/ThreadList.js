import React, {useEffect, useState, useContext} from 'react';
import Thread from './Thread';
import {db} from '../firebase';
import {AuthContext} from '../Auth/AuthProvider';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
	floatButton: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	}
}))
 

const ThreadList = (props) => {
	const classes = useStyles();
	const [threads, setThreads] = useState([]);
	const currentUser  = useContext(AuthContext);
    const uid = currentUser.currentUser ? currentUser.currentUser.uid : "";

	useEffect(() => {
		db.collection('threads').get()
		  .then((snapshot) => {
			  const items = [];
			  snapshot.forEach((doc) => {
				items.push(doc.data())
			  });
			setThreads(items);
		})
	}, []);

	const alert = () => {
		toast('ログインして投稿しよう')
	}

	return (
	    <div>
			<Grid
			container
			direction="column"
			justify="center"
			alignItems="center"
		   >
				<motion.div initial={{y: '100vh'}}
							animate={{y: 0}}
							exit={{y: '100vh'}}
							transition={{duration: 0.1, type: 'tween'}}
				>
				{threads.map((thread, i) => (
							<Thread key={i} thread={thread} history={props.history} />
				))}
		        </motion.div> 
		   </Grid>
		   {uid == "" ? (
			 <Fab className={classes.floatButton} component="span" 
			     onClick={() => {alert()}} 
			>
			    <AddIcon />
			</Fab>
		   ) : (
			 <Link to={'/input'}>
				<Fab className={classes.floatButton} component="span">
				  <AddIcon />
			    </Fab>
			 </Link>
		   )}
		</div>
	)
}

export default ThreadList;
