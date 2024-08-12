import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { SiCodesignal } from "react-icons/si";
import axios from 'axios';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserName(user.username);
      }
    };

    fetchUser();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingPost) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}api/post/${editingPost._id}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}api/post`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setTitle('');
      setContent('');
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post', error);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPost(post);
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white py-4 px-6 w-full shadow fixed">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="#" className="flex items-center gap-2">
            <SiCodesignal className="h-10 w-10" />
            <span className="text-xl font-bold">{userName}'s Blogs</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8 mt-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">{editingPost ? 'Edit Post' : 'Create a New Post'}</h1>
          <form onSubmit={handleSubmit} ref={formRef} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-20">
            <div className="mb-4">
              <label htmlFor="title" className="block text-lg font-bold text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="mt-1 block w-full h-10 p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-lg font-bold text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter post content"
                className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-black text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 px-4 py-2 rounded-md"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setTitle('');
                    setContent('');
                  }}
                  className="bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts?.map(post => (
              <div key={post._id} className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2">
                  <div className='flex justify-between'>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    {/* <h2 className="text-xl font-semibold text-red-600">{post.author.username}</h2> */}
                  </div>
                  <p className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
                <p>{post.content}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-primary text-primary-foreground py-4 px-6 shadow">
        <div className="container mx-auto text-center">
          &copy; 2024 Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
