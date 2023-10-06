const blogStats = document.getElementById('blogStats');
const blogList = document.getElementById('blogList');

function fetchAllBlogs() {
  fetch('/api/blogs')
    .then(response => response.json())
    .then(data => {
        blogs = data.blogs
        displayBlogs(blogs);
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function searchBlogs() {
  const searchInput = document.getElementById('searchInput').value;
  if (!searchInput) {
    fetchAllBlogs()
  }
  fetch(`/api/blog-search?query=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
    .then(data => {
          displayBlogs(data.blogs);
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function displayBlogs(blogs) {
  blogList.innerHTML = '';
  if (blogs.length === 0) {
    blogList.innerHTML = '<p>No blogs found.</p>';
    return;
  }
  const ul = document.createElement('ul');
  blogs.forEach(blog => {
    const li = document.createElement('li');
    li.textContent = blog.title;
      
    ul.appendChild(li);
  });
  blogList.appendChild(ul);
}

function viewBlogStats() { 
  fetch('/api/blog-stats')
  .then((response) => response.json())
    .then((data) => {
    
    blogStats.classList.toggle('hidden');
    blogList.classList.toggle('hidden');
      
    blogStats.innerHTML = `
      <p>Total Blogs: ${data.totalBlogs}</p>
      <p>Longest Title: ${data.longestTitleBlog}</p>
      <p>Number of Blogs with 'privacy' in Title: ${data.privacyBlogs}</p>
      <p>Unique Blog Titles: ${data.uniqueBlogTitles.join(',<br>')}</p>
    `;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

fetchAllBlogs();