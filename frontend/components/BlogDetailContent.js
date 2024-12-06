import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../src/context/ThemeContext";

const BlogDetailContent = ({ blog }) => {
  const { darkMode } = useTheme();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // Hangi yoruma cevap veriliyor
  const [replyText, setReplyText] = useState(""); // Yanıt metni

  // Yorumları ve kullanıcı bilgilerini fetch eden fonksiyon
  const fetchCommentsWithUsernames = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blogs/${blog._id}`
      );
      const comments = response.data.comments;

      const userIds = [
        ...new Set(
          comments.flatMap((comment) => [
            comment.user,
            ...(comment.replies?.map((reply) => reply.user) || []),
          ])
        ),
      ];

      const userResponses = await Promise.all(
        userIds.map((id) =>
          axios.get(`http://localhost:5000/api/users/${id}`).then((res) => ({
            id,
            username: res.data.username,
          }))
        )
      );

      const userMap = userResponses.reduce((map, user) => {
        map[user.id] = user.username;
        return map;
      }, {});

      const commentsWithUsernames = comments.map((comment) => ({
        ...comment,
        user: userMap[comment.user] || "Anonim",
        replies: comment.replies?.map((reply) => ({
          ...reply,
          user: userMap[reply.user] || "Anonim",
        })),
      }));

      setComments(commentsWithUsernames);
    } catch (error) {
      console.error("Yorumlar alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentsWithUsernames();
  }, [blog._id]);

  const handleReplySubmit = async (parentCommentId) => {
    try {
      const token = localStorage.getItem("token"); // Kullanıcı token'ını localStorage'den al
      if (!token) {
        console.error("Kullanıcı oturumu yok");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blog._id}/comments`,
        {
          text: replyText,
          replyTo: parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı gönder
          },
        }
      );

      setComments((prevComments) => {
        const addReplyToComment = (comments) => {
          return comments.map((comment) => {
            if (comment._id === parentCommentId) {
              return {
                ...comment,
                replies: [...comment.replies, response.data], // Yeni yanıtı ekle
              };
            }

            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            }

            return comment;
          });
        };

        return addReplyToComment(prevComments);
      });

      setReplyingTo(null); // Yanıt formunu kapat
      setReplyText(""); // Yanıt metnini temizle
    } catch (error) {
      console.error("Yanıt gönderilirken bir hata oluştu:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      {/* Blog Görseli */}
      {blog.image && (
        <div className="mb-4">
          <img
            src={`http://localhost:5000${blog.image}`}
            alt={blog.title}
            className="w-full max-w-4xl h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Blog Başlık ve Bilgiler */}
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold mb-2">{blog.title}</h1>
        <div className="text-gray-600 mb-2">
          <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
          <p>{blog.views} görüntüleme</p>
        </div>

        {/* Blog İçeriği */}
        <div className="prose max-w-none mb-6 text-left">
          <p>{blog.content}</p>
        </div>

        {/* Etiketler */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Etiketler</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {blog.tags.map((tag) => (
                <span
                  key={tag._id}
                  className={`text-white px-3 py-1 rounded-full text-sm ${
                    darkMode ? "bg-[#0026CA]" : "bg-[#304FFE]"
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Yorumlar */}
      <div className="comments mt-8 text-left w-full max-w-4xl">
        <h3 className="font-bold text-2xl mb-4">{comments.length} Yorumlar</h3>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReplySubmit={handleReplySubmit}
            />
          ))
        ) : (
          <p>Henüz yorum yok.</p>
        )}
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
}) => {
  return (
    <div className="mb-4 border-b border-blue-600">
      <div className="flex gap-4 mb-2">
        <div className="font-bold text-blue-600">{comment.user}</div>
        <div className="text-gray-500 text-sm">
          {new Date(comment.createdAt).toLocaleDateString()}
        </div>
      </div>
      <p className="pl-4">{comment.text}</p>
      <button
        onClick={() => setReplyingTo(comment._id)}
        className="text-blue-500 text-sm mt-2"
      >
        Cevapla
      </button>

      {replyingTo === comment._id && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded-lg p-2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Yanıtınızı yazın..."
          ></textarea>
          <button
            onClick={() => handleReplySubmit(comment._id)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Gönder
          </button>
        </div>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply._id}
            comment={reply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReplySubmit={handleReplySubmit}
          />
        ))}
    </div>
  );
};

export default BlogDetailContent;
