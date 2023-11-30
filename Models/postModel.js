class Post {
    constructor(id, title, content, author, authorId, authorUsername, votes, upvoters, comments) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.author = author;
      this.authorId = authorId;
      this.authorUsername = authorUsername;
      this.votes = votes || 0;
      this.upvoters = upvoters;
      this.comments = comments || [];
    }
}
export default Post;

    