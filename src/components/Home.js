import React, {useEffect} from 'react';
import {AuthContext} from '../Auth/AuthProvider';
import ThreadList from './ThreadList';
import { motion } from 'framer-motion';

const Home = (props) => {
	return (
		<div>
			<ThreadList history={props.history} />
		</div>
	)
}

export default Home;