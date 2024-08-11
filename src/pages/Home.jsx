import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { SiCodesignal } from 'react-icons/si';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/all-posts`);
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const token = localStorage.getItem('token');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white py-4 px-6 w-full fixed shadow">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="#" className="flex items-center gap-2">
            <SiCodesignal className="h-10 w-10" />
            <span className="text-xl font-bold">Blogs</span>
          </Link>
          <nav className="flex items-center gap-4">
            {token ? (
              <>
                <Link
                  to="/owner"
                  className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Your Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="rounded-md bg-primary-foreground px-4 py-2 text-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8 mt-20">
        <div className=" container mx-auto">
          <h1 className="text-3xl font-bold mb-6">All Posts</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-2">

                  <h2 className="text-xl font-semibold">{post.title}</h2>

                  <p className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
                <p>{post.content}</p>
                <div className='flex justify-center mt-10'>
                  <span className='text-sm font-bold mr-1 text-gray-700 mt-1'>Posted by </span><h2 className="text-xl font-semibold text-red-600"> {post.author.username}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-primary text-primary-foreground py-4 px-6 shadow">
        <div className="container mx-auto text-center">
          &copy; 2024 Blogs. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
