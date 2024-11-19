"use client";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please select an image");
      return;
    }

    try {
      setIsLoading(true);

      // Upload image to Cloudinary
      const formDataObj = new FormData();
      formDataObj.append("file", formData.image);
      formDataObj.append("upload_preset", "priyanshu"); // Replace with your Cloudinary upload preset

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dijwgtlay/auto/upload`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Image upload failed");
      }

      const { secure_url: imageUrl } = await cloudinaryResponse.json();
      if (!imageUrl) {
        throw new Error("Image URL not returned from Cloudinary");
      }

      // Register user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: imageUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("User registered successfully");
      setFormData({ name: "", email: "", password: "", image: null });
      setImagePreview(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
