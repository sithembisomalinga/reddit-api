
import firebase from '../firebase/Firebase.js';
import Post from '../Models/postModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
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

  // Code to get post by ID from database
  export const getPost = async (req, res, next) => {
    try {
      const postId = req.params.id;
      const postRef = doc(db, 'posts', postId);
      const postData = await getDoc(postRef);
  
      if (postData.exists()) {
        const post = new Post(
          postData.data().id,
          postData.data().title,
          postData.data().content,
          postData.data().author,
          postData.data().authorId,
          postData.data().authorUsername,
          postData.data().votes,
          postData.data().comments || [],
        );
        res.status(200).send(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Code to update a post 
export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const updatedData = req.body;

    const postRef = doc(db, 'posts', postId);
    const postData = await getDoc(postRef);

    if (postData.exists()) {
      await updateDoc(postRef, updatedData);

      // Fetch the updated post data
      const updatedPostData = await getDoc(postRef);

    const updatedPost = new Post(
      updatedPostData.data().id,
      updatedPostData.data().title,
      updatedPostData.data().content,
      updatedPostData.data().author,
      updatedPostData.data().authorId,
      updatedPostData.data().authorUsername,
      updatedPostData.data().votes,
      updatedPostData.data().comments || [],
    );

    res.status(200).send(updatedPost);
  } else {
    res.status(404).send('Post not found');
  }
} catch (error) {
  res.status(400).send(error.message);
}
};

// Code to delete post from database
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const postRef = doc(db, 'posts', postId);
    const postData = await getDoc(postRef);

    if (postData.exists()) {
      await deleteDoc(postRef);
      res.status(200).send('Post deleted successfully');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Code for getting post from specific user using their user id
export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.userId; 
    
    // Query posts collection to get posts created by the user
    const collectionRef = collection(db, 'posts');
    const  q = query(collectionRef,where('authorId', '==', userId) );

    const userPostsSnapshot = await getDocs(q);

    if (userPostsSnapshot.empty) {
      res.status(404).send('No posts found for this user');
    } else {
      const userPosts = [];
      userPostsSnapshot.forEach((doc) => {
        const postData = doc.data();
        const post = new Post(
          postData.data().id,
          postData.title,
          postData.content,
          postData.author,
          postData.data().authorId,
          postData.data().authorUsername,
          postData.votes,
          postData.comments || []
        );
        userPosts.push(post);
      });
      res.status(200).send(userPosts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Code to upvote a post
export const upvotePost = async (req, res, next) => {
  try {
    const postId = req.params.id; 
    const userId = req.body.userId; 

    // Logic to find and upvote the post in the database
    const postRef = doc(db, 'posts', postId);
    const postData = await getDoc(postRef);

    if (postData.exists()) {
      // Check if the user has already upvoted the post
      const upvotersList = postData.data().upvoters || [];

      if (upvotersList.includes(userId)) {
        // If the user has already upvoted, send a response indicating so
        return res.status(400).send('User has already upvoted this post');
      }

      const updatedUpvotersList = [...upvotersList, userId];
      const currentUpvotes = postData.data().votes;
      const newUpvotes = currentUpvotes + 1;

      await updateDoc(postRef, {
        ...postData.data(),
        votes: newUpvotes,
        upvoters: updatedUpvotersList,
      });

      // Fetch the updated post data
      const updatedPostData = await getDoc(postRef);

      // Create a new Post instance with the updated data
      const updatedPost = new Post(
        updatedPostData.data().id,
        updatedPostData.data().title,
        updatedPostData.data().content,
        updatedPostData.data().author,
        updatedPostData.data().authorId,
        updatedPostData.data().authorUsername,
        updatedPostData.data().votes,
        updatedPostData.data().comments || [],
      );

      res.status(200).send(updatedPost);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// code to downvote a post
export const downvotePost = async (req, res, next) => {
  try {
    const postId = req.params.id; 
    const userId = req.body.userId; 

    // Logic to find and downvote the post in the database
    const postRef = doc(db, 'posts', postId);
    const postData = await getDoc(postRef);

    if (postData.exists()) {
      // Check if the user has upvoted the post
      const upvotersList = postData.data().upvoters || [];

      if (!upvotersList.includes(userId)) {
        // If the user hasn't upvoted, send an error response
        return res.status(400).send('User must have upvoted to be able to downvote');
      }

      // Remove the user ID from the upvoters list
      const updatedUpvotersList = upvotersList.filter((id) => id !== userId);

      // Update the post by decrementing the votes and removing the user from upvoters
      const currentDownvotes = postData.data().votes;
      const newDownvotes = currentDownvotes - 1;

      await updateDoc(postRef, {
        ...postData.data(),
        votes: newDownvotes,
        upvoters: updatedUpvotersList,
      });

     
      const updatedPostData = await getDoc(postRef);

      // Create a new Post instance with the updated data
      const updatedPost = new Post(
        updatedPostData.data().id,
        updatedPostData.data().title,
        updatedPostData.data().content,
        updatedPostData.data().author,
        updatedPostData.data().authorId,
        updatedPostData.data().authorUsername,
        updatedPostData.data().votes,
        updatedPostData.data().comments || [],
      );

      res.status(200).send(updatedPost);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Code to add comments to the post
export const addCommentToPost = async (req, res, next) => {
  try {
    const postId = req.params.id; 
    const comment = req.body; 

    // Logic to find and add a comment to the post in the database
    const postRef = doc(db, 'posts', postId);
    const postData = await getDoc(postRef);

    if (postData.exists()) {
      // Generate a random 10-digit number as the comment ID
      const commentId = Math.floor(1000000000 + Math.random() * 9000000000); 

      // Fetch the updated post data
      const currentComments = postData.data().comments || [];
      const newComment = { ...comment, id: commentId }; // Include the generated comment ID

      const updatedComments = [...currentComments, newComment];

      await updateDoc(postRef, {
        ...postData.data(),
        comments: updatedComments,
      });

      // Fetch the updated post data
      const updatedPostData = await getDoc(postRef);

      // Create a new Post instance with the updated data
      const updatedPost = new Post(
        updatedPostData.data().id,
        updatedPostData.data().title,
        updatedPostData.data().content,
        updatedPostData.data().author,
        updatedPostData.data().authorId,
        updatedPostData.data().authorUsername,
        updatedPostData.data().votes,
        updatedPostData.data().comments || [],
      );

      res.status(200).send(updatedPost);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// Code upvote an existing comment
export const upvoteComment = async (req, res, next) => {
try {
  const postId = req.params.postId; 
  const commentId = req.params.commentId; 

  // Logic to find and upvote the comment in the database
  const postRef = doc(db, 'posts', postId);
  const postData = await getDoc(postRef);

  if (postData.exists()) {
    const currentComments = postData.data().comments || [];
    const updatedComments = currentComments.map((existingComment) => {
      console.log(existingComment.id)
      if (existingComment.id.toString() === commentId) {
        existingComment.votes += 1; // Increase the votes for upvote
      }
      return existingComment;
    });
    await updateDoc(postRef, {
      ...postData.data(),
      comments: updatedComments,
    });

    res.status(200).send('Comment upvoted successfully');
  } else {
    res.status(404).send('Post not found');
  }
} catch (error) {
  res.status(400).send(error.message);
}
};


// Code to downvote and existing comment
export const downvoteComment = async (req, res, next) => {
try {
  const postId = req.params.postId; 
  const commentId = req.params.commentId; 

  // Logic to find and downvote the comment in the database
  const postRef = doc(db, 'posts', postId);
  const postData = await getDoc(postRef);

  if (postData.exists()) {
    const currentComments = postData.data().comments || [];
    const updatedComments = currentComments.map((existingComment) => {
      console.log(existingComment.id)
      if (existingComment.id.toString() === commentId) {
        existingComment.votes -= 1; // Decrease the votes for downvote
      }
      return existingComment;
    });

    await updateDoc(postRef, {
      ...postData.data(),
      comments: updatedComments,
    });

    res.status(200).send('Comment downvoted successfully');
  } else {
    res.status(404).send('Post not found');
  }
} catch (error) {
  res.status(400).send(error.message);
}
};

export const getUpvotedPostsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Get user ID from request parameters
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
          doc.data().upvoters,
          doc.data().comments || [], 
        );
        postArray.push(post);
      });
    }
    // Logic to retrieve posts upvoted by the user from your database
    const upvotedPosts = []; // Array to store posts upvoted by the user
    // Fetch posts based on the user's ID present in the upvoters list
    const allPosts = postArray; 
    console.log(allPosts);
    allPosts.forEach((post) => {
      if (post.upvoters && post.upvoters.includes(userId)) {
        upvotedPosts.push(post);
      }
    });

    res.status(200).send(upvotedPosts);
  } catch (error) {
    res.status(400).send(error.message);
  }
  }
