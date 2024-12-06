import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../store/slices/commentsSlice";

const AddComment = ({ blogId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // Yanıtlanan yorum ID'si
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.comments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addComment({ blogId, text, replyTo }));
    if (addComment.fulfilled.match(result)) {
      onCommentAdded(result.payload); // Yeni yorumu parent bileşene gönder
      setText(""); // Formu temizle
      setReplyTo(null);
    }
  };

  return (
    <div className="add-comment flex flex-col items-center justify-center px-4 py-8">
      <h1>Yorumunuzu yazın</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Yorumunuzu yazın..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-lg p-2"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AddComment;
