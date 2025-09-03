import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// ES Module এ __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static folder to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('MySQL connected!');
});

// user profile
// Profile image uploads folder
const profileFolder = path.join(__dirname, 'uploads', 'profile');

// Folder
import fs from 'fs';
if (!fs.existsSync(profileFolder))
  fs.mkdirSync(profileFolder, { recursive: true });

// Multer storage for profile image
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const profileUpload = multer({ storage: profileStorage });

// Registration route with image
app.post('/register', profileUpload.single('image'), async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Profile image path
    const imagePath = req.file ? `/uploads/profile/${req.file.filename}` : null;

    const query =
      'INSERT INTO users (name, email, password, role, image, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

    db.query(
      query,
      [name, email, hashedPassword, role || 'user', imagePath],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({
          created: true,
          userId: result.insertId,
          image: imagePath,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Find user in DB
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token to client
    res.json({ message: 'Login successful', token });
  });
});

// image upload
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'news'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST endpoint for news

app.post('/news', upload.single('image'), (req, res) => {
  try {
    const { title, categories, description, publish, headline } = req.body;
    const image = req.file ? `/uploads/news/${req.file.filename}` : '';

    // categories parse
    let categoryArray = [];
    if (categories) {
      categoryArray = JSON.parse(categories);
    }
    const categoryString = categoryArray.join(', ');

    // headline boolean (true/false আসবে checkbox থেকে)
    const headlineValue = headline === 'true' ? 1 : 0;

    const sql = `INSERT INTO news (title, image, category, description, publish, headline)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
      title,
      image,
      categoryString,
      description,
      publish,
      headlineValue,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database insert failed' });
      }
      res.json({ message: 'News saved successfully', id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  category filter
app.get('/news', (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  const sql = `SELECT * FROM news WHERE category LIKE ? ORDER BY publish DESC`;
  const value = `%${category}%`;

  db.query(sql, [value], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    res.json(results);
  });
});

//search news
app.get('/search-news', (req, res) => {
  const search = req.query.search;
  console.log('Search value:', search); // debug

  if (!search) {
    return res.status(400).json({ message: 'Search value is required' });
  }

  const sql = `
    SELECT * FROM news 
    WHERE title LIKE ? 
       OR category LIKE ? 
       OR description LIKE ?
    ORDER BY publish DESC
  `;
  const value = `%${search.trim()}%`;

  db.query(sql, [value, value, value], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    res.json(results);
  });
});

// single news
app.get('/single-news/:id', (req, res) => {
  const id = req.params.id;

  // query to get single news
  const query = 'SELECT * FROM news WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    // send the news data
    res.json(results[0]);
  });
});

// get all with pagination
app.get('/all-news', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  let offset = (page - 1) * limit;
  let search = req.query.search || ''; // search query

  // Count total rows with search
  const countSql = search
    ? 'SELECT COUNT(*) AS total FROM news WHERE title LIKE ? OR category LIKE ?'
    : 'SELECT COUNT(*) AS total FROM news';

  const countParams = search ? [`%${search}%`, `%${search}%`] : [];

  db.query(countSql, countParams, (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    const total = countResult[0].total;

    // Get paginated rows with search
    const sql = search
      ? 'SELECT * FROM news WHERE title LIKE ? OR category LIKE ? ORDER BY publish DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM news ORDER BY publish DESC LIMIT ? OFFSET ?';

    const params = search
      ? [`%${search}%`, `%${search}%`, limit, offset]
      : [limit, offset];

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        data: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});

// delete news
app.delete('/news/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM news WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ deleted: true });
  });
});

// Update news route
app.put('/news-update/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, description, publish } = req.body;

  const sql = `
    UPDATE news
    SET title = ?, category = ?, description = ?, publish = ?
    WHERE id = ?
  `;

  db.query(sql, [title, category, description, publish, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update news' });
    }
    res.json({ message: 'News updated successfully', result });
  });
});

//get all user
app.get('/all-user', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  // Count total rows with search
  const countSql = search
    ? 'SELECT COUNT(*) AS total FROM users WHERE name LIKE ? OR email LIKE ? OR role LIKE ?'
    : 'SELECT COUNT(*) AS total FROM users';
  const countParams = search
    ? [`%${search}%`, `%${search}%`, `%${search}%`]
    : [];

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    const total = countResult[0].total;

    // Get paginated users with search
    const sql = search
      ? 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR role LIKE ? LIMIT ? OFFSET ?'
      : 'SELECT * FROM users LIMIT ? OFFSET ?';
    const params = search ? [...countParams, limit, offset] : [limit, offset];

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      res.status(200).json({
        data: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});

// API route to get user info by email
app.get('/user/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email); // decode back
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
    if (results.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// add category
app.post('/add-category', (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  const sql = 'INSERT INTO news_category (category) VALUES (?)';

  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error('Error inserting category:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({
      message: 'Category added successfully!',
      id: result.insertId,
      category,
    });
  });
});

// Get all categories
app.get('/get-category', (req, res) => {
  const sql = 'SELECT * FROM news_category';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(result);
  });
});

// Delete category API
app.delete('/delete-category/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM news_category WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Failed to delete category' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ deleted: true });
  });
});

// Dashboard data;
app.get('/dashboard-data', (req, res) => {
  try {
    const totalUsersSql = 'SELECT COUNT(*) AS totalUsers FROM users';
    const totalNewsSql = 'SELECT COUNT(*) AS totalNews FROM news';
    const totalCategorySql =
      'SELECT COUNT(*) AS totalCategory FROM news_category';
    const totalHeadlinesSql = 'SELECT COUNT(title) AS totalHeadlines FROM news';

    db.query(totalUsersSql, (err, usersResult) => {
      if (err) throw err;

      db.query(totalNewsSql, (err, newsResult) => {
        if (err) throw err;

        db.query(totalCategorySql, (err, categoryResult) => {
          if (err) throw err;

          db.query(totalHeadlinesSql, (err, headlineResult) => {
            if (err) throw err;

            res.json({
              totalUsers: usersResult[0].totalUsers,
              totalNews: newsResult[0].totalNews,
              totalCategory: categoryResult[0].totalCategory,
              totalHeadlines: headlineResult[0].totalHeadlines,
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Dashboard data error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get headline
app.get('/get-headline', (req, res) => {
  const query = 'SELECT * FROM news WHERE headline = 1 ORDER BY createdAt DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    const titles = results.map(row => row.title);
    res.json(titles);
  });
});

// Insert a comment
app.post('/comments', (req, res) => {
  const { news_id, name, email, image, role, comment } = req.body;

  if (!news_id || !name || !email || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query =
    'INSERT INTO comments (news_id, name, email, image, role, comment) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [news_id, name, email, image || null, role || null, comment];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res
        .status(500)
        .json({ message: 'Database insert failed', error: err });
    }

    res.status(201).json({
      isComment: true,
      commentId: result.insertId,
    });
  });
});

// get comments
app.get('/comments/:newsId', (req, res) => {
  const newsId = req.params.newsId;

  const query =
    'SELECT * FROM comments WHERE news_id = ? ORDER BY created_at DESC';
  db.query(query, [newsId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to fetch comments' });
    }

    res.json(results); // return array of comments
  });
});

// save pixel code
app.post('/pixels', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Pixel code is required' });
  }

  const query = 'INSERT INTO pixels (code, created_at) VALUES (?, NOW())';

  db.query(query, [code], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(201).json({ message: 'Pixel saved!', id: result.insertId });
  });
});

// Get latest pixel code
app.get('/pixels/latest', (req, res) => {
  const query = 'SELECT * FROM pixels ORDER BY created_at DESC LIMIT 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No pixel code found' });
    }

    // Return only the latest pixel code
    res.status(200).json({
      id: results[0].id,
      code: results[0].code,
      created_at: results[0].created_at,
    });
  });
});

// save company info
app.post('/api/company', (req, res) => {
  const { name, email, phone, address, description, logo } = req.body;

  const query = `
    INSERT INTO company_info
    (name, email, phone, address, description, logo, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const values = [name, email, phone, address, description, logo || null];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(201).json({
      message: 'Company info saved successfully!',
      id: result.insertId,
    });
  });
});

// Get company info
app.get('/company-info', (req, res) => {
  const query = 'SELECT * FROM company_info ORDER BY created_at DESC LIMIT 1'; // assuming only one row

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to fetch company info' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Company info not found' });
    }

    res.json(results[0]); // send first row
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Daily news server running ');
});

app.listen(process.env.PORT, () => {
  console.log(` Server running on port ${process.env.PORT}`);
});
