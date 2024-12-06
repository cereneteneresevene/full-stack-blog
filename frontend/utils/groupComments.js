// utils/groupComments.js
const groupComments = (comments) => {
    const map = {};
    const roots = [];
  
    comments.forEach((comment) => {
      map[comment._id] = { ...comment.toObject(), replies: [] };
    });
  
    comments.forEach((comment) => {
      if (comment.replyTo) {
        map[comment.replyTo]?.replies.push(map[comment._id]);
      } else {
        roots.push(map[comment._id]);
      }
    });
  
    return roots;
  };
  
  module.exports = groupComments;
  