"use client";
import { useReviews } from "@/hooks/api/useReviews";
import { useUser } from "@/hooks/api/useUser";
import { useState } from "react";

export const useReviewForm = (productId, onClose) => {
  const { user } = useUser();
  const { submitReview } = useReviews();

  const [rating, setRating] = useState(0);
  const [hovered, setHoveredRating] = useState(0);
  const [form, setForm] = useState({ title: "", body: "" });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUploaded = (url) => setUploadedImages((prev) => [...prev, url].slice(0, 6));
  const removeImage = (idx) => setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !form.body) return;
    setIsSubmitting(true);
    try {
      await submitReview.mutateAsync({
        productId,
        reviewData: {
          rating,
          title: form.title || form.body.slice(0, 30) + "...",
          body: form.body,
          images: uploadedImages,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";

  return {
    user, rating, setRating, hovered, setHoveredRating, form, setForm,
    uploadedImages, isSubmitting, submitted, handleImageUploaded, removeImage,
    handleSubmit, fullName
  };
};
