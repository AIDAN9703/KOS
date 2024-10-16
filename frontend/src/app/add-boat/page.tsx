'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddBoat() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    length: '',
    capacity: '',
    location: '',
    pricePerDay: '',
    description: '',
    features: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...newImages].slice(0, 10));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      images.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });

      await axios.post('http://localhost:5000/api/boats', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      router.push('/owners-portal');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred while adding the boat');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Add Your Boat
        </h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Boat Name</label>
              <input type="text" name="name" id="name" required
                className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange} value={formData.name} />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Boat Type</label>
              <select name="type" id="type" required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold sm:text-sm"
                onChange={handleChange} value={formData.type}>
                <option value="">Select a type</option>
                <option value="Yacht">Yacht</option>
                <option value="Sailboat">Sailboat</option>
                <option value="Catamaran">Catamaran</option>
                <option value="Motorboat">Motorboat</option>
              </select>
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length (ft)</label>
              <input type="number" name="length" id="length" required
                className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange} value={formData.length} />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
              <input type="number" name="capacity" id="capacity" required
                className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange} value={formData.capacity} />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" required
                className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange} value={formData.location} />
            </div>
            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">Price per Day ($)</label>
              <input type="number" name="pricePerDay" id="pricePerDay" required
                className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange} value={formData.pricePerDay} />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows={3} required
              className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange} value={formData.description}></textarea>
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
            <input type="text" name="features" id="features" required
              className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange} value={formData.features} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Boat Images (up to 10)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload}
              className="mt-1 focus:ring-gold focus:border-gold block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            <p className="mt-2 text-sm text-gray-500">{images.length} / 10 images selected</p>
          </div>
          <div>
            <button type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold">
              Add Boat
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
