
import firebase from '../firebase/Firebase.js';
import Post from '../Models/postModel.js';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

const db = getFirestore(firebase);


export const createPost = async (req, res, next) => {
    try {
      const data = req.body;

    const docRef= await addDoc(collection(db, "posts"), data);
    const docID = docRef.id;

     // Update the document with the ID
     await updateDoc(docRef, {
  id: docID
});
     
  
      res.status(200).send('Post created successfully');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

// Code to get all the posts
  export const getPosts = async (req, res, next) => {
    try {
      const posts = await getDocs(collection(db, 'posts'));
      const postArray = []; 
      if (posts.empty) {
        res.status(400).send('No Posts found');
      } else {
        posts.forEach((doc) => {
          const post = new Post(
            doc.data().id,
            doc.data().title,
            doc.data().content,
            doc.data().author,
            doc.data().authorId,
            doc.data().authorUsername,
            doc.data().votes, 
            doc.data().comments || [], 
          );
          postArray.push(post);
        });
  
        res.status(200).send(postArray);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };