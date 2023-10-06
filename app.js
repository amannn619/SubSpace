// app.js
const express = require('express');
const lodash = require('lodash');
const axios = require('axios');
const app = express();
const port = 8080;

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static(__dirname + '/static')); // Serve static files from the 'public' folder

let blogData = null; 

// async function fetchBlogData() {
//   try {
//     const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
//       headers: {
//         'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
//       }
//     });
//     blogData = response.data;
//   } catch (error) {
//     console.error('Error fetching blog data:', error);
//   }
// }
// fetchBlogData();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/blogs', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      }
    });
    const blogData = response.data;
    
    if (!blogData) {
      return res.status(500).json({ error: 'Blog data not available.' });
    }
    
    res.json(blogData);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Error fetching blog data.' });
  }
});

app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      }
    });
    const blogData = response.data;
    if (!blogData) {
      return res.status(500).json({ error: 'Blog data not available.' });
    }
    const totalBlogs = lodash.size(blogData.blogs)
    const longestTitleBlog = lodash.maxBy(blogData.blogs, blog => blog.title.length);
    const privacyBlogs = lodash.filter(blogData.blogs, blog =>
      lodash.includes(lodash.toLower(blog.title), 'privacy')
    );
    const uniqueBlogs = lodash.uniqBy(blogData.blogs, blog => blog.title);
    const uniqueBlogTitlesArray = uniqueBlogs.map((blog) => blog.title)
    
    const analyticsResults = {
      totalBlogs: totalBlogs,
      longestTitleBlog: longestTitleBlog.title,
      privacyBlogs: lodash.size(privacyBlogs),
      uniqueBlogTitles: uniqueBlogTitlesArray
    }
    res.json(analyticsResults)
  }catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Error fetching blog data.' });
  }
});
  
app.get('/api/blog-search', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      }
    });
    const blogData = response.data;
    const query = req.query.query;
    if (!blogData) {
      return res.status(500).json({ error: 'Blog data not available.' });
    }
    const searchResults = lodash.filter(blogData.blogs, blog =>
      lodash.includes(lodash.toLower(blog.title), lodash.toLower(query))
    );
    res.json({ blogs: searchResults });
  }catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Error fetching blog data.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
