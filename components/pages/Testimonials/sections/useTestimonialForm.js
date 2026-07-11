"use client";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import { useUser } from "@/hooks/api/useUser";
import { useState } from "react";

export const useTestimonialForm = (onClose) => {
  const { user } = useUser();
  const { submitTestimonial } = useTestimonials();

  const [rating, setRating] = useState(0);
  const [hovered, setHoveredRating] = useState(0);
  const [form, setForm] = useState({ content: "" });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUploaded = (url) => setUploadedImages((prev) => [...prev, url].slice(0, 3));
  const removeImage = (idx) => setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !form.content) return;
    setIsSubmitting(true);
    try {
      await submitTestimonial.mutateAsync({
        content: form.content,
        rating,
        images: uploadedImages,
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
