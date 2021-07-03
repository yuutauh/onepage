import React from 'react';
import { ReactComponent as Logo } from '../styles/cogicogi.svg';
import { motion } from 'framer-motion';

const logo = {
	initial: {
		y: '-70px'
	}
}

const detail = {
	hidden: { opacity: 0,
		      x: '100vw'
	          },
	visible: { opacity: 1 ,
		       x: 0,
		       transition: {
			   ease: 'easeInOut'
			   }
	}
}

const CommentListModal = () => {
	return (
		<Logo />
	)
}

export default CommentListModal
