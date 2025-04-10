import React, { useState, useEffect } from "react";
import { FaTrash, FaComment, FaStar, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  customerdeleteReview,
  customerGetReviews,
  customerUpdateReview,
} from "../services/userservices";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editStar, setEditStar] = useState(0);

  useEffect(() => {
    customerGetReviews()
      .then((res) => {
        setReviews(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (reviewId) => {
    customerdeleteReview(reviewId)
      .then((res) => {
        toast.success(res.data.message);
        setReviews(reviews.filter((review) => review._id !== reviewId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditText(review.description);
    setEditStar(review.star);
  };

  const handleUpdate = () => {
    customerUpdateReview(editingReview, {
      star: editStar,
      description: editText,
    }) // Use editingReview as reviewId
      .then((res) => {
        toast.success(res.data.message);
        setReviews(
          reviews.map((review) =>
            review._id === editingReview
              ? { ...review, star: editStar, description: editText }
              : review
          )
        );
        setEditingReview(null); // Reset editing state after update
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <div className="bg-base-100 shadow-xl rounded-xl p-4 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaComment className="w-6 h-6" /> My Reviews
        </h2>

        <div className="overflow-x-auto">
          <table className="table w-full border border-base-300 rounded-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Star rating</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr
                  key={review._id}
                  className="hover:bg-primary/10 border-b border-base-300"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{review.service_id?.title}</td>
                  <td className="p-4 flex">
                    {editingReview === review._id ? (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < editStar
                                ? "text-yellow-500 cursor-pointer"
                                : "text-gray-400 cursor-pointer"
                            }
                            onClick={() => setEditStar(i + 1)} // Allow selecting new star rating
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.star
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {editingReview === review._id ? (
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      review.description
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editingReview === review._id ? (
                      <button
                        onClick={handleUpdate}
                        className="btn btn-sm btn-success"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(review)}
                        className="btn btn-sm btn-warning flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="btn btn-sm btn-error flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10"></div>
    </div>
  );
}

export default CustomerReviews;
