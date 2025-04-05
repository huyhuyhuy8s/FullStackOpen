import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Use State hooks
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Blog's use state hooks
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [newBlog, setNewBlog] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleCreateNew = async (event) => {
    event.preventDefault();

    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      });
      setSuccessMessage(`a new blog ${title} by ${author} added`);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedUser");
    blogService.setToken(null);
    setUser(null);
  };

  const loginForm = () => {
    return (
      <div>
        <h2>login in to application</h2>
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => {
                setUsername(target.value);
              }}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />
          </div>
          <button>login</button>
        </form>
      </div>
    );
  };

  const blogsForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <form onSubmit={handleLogout}>
          <p>
            {user.name} logged in
            <button>logout</button>
          </p>
        </form>
        {createBlogForm()}
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  const createBlogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreateNew}>
          <div>
            title
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button>create</button>
        </form>
      </div>
    );
  };

  return <div>{user === null ? loginForm() : blogsForm()}</div>;
};

export default App;
