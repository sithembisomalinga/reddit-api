import { initializeApp } from 'firebase/app'; 
import config from '../Config.js';

const firebase = initializeApp(config.firebaseConfig);


export default firebase;
