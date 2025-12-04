
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// === Configuration ===
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// === Mock Database (In-Memory for demo, replace with SQL/Mongo) ===
const db = {
  users: [
    { id: 'u1', email: 'admin@xinhuashe.com', password: 'password', name: 'Admin', role: 'root_admin' },
    { id: 'u2', email: 'creator@xinhuashe.com', password: 'password', name: 'ArtMaster', role: 'creator' }
  ],
  projects: [], // Will be populated
  artworks: []
};

// === Middleware ===
const authenticate = (req, res, next) => {
  // Simple token simulation
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// === Routes ===

// 1. Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token: 'mock-jwt-token-' + Date.now() });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// 2. Projects
app.get('/api/projects', authenticate, (req, res) => {
  res.json(db.projects);
});

app.post('/api/projects', authenticate, (req, res) => {
  const newProject = {
    id: 'p_' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.projects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const index = db.projects.findIndex(p => p.id === id);
  if (index > -1) {
    db.projects[index] = { ...db.projects[index], ...req.body };
    res.json(db.projects[index]);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// 3. Artworks
app.get('/api/artworks', (req, res) => {
  res.json(db.artworks);
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- API Endpoint: http://localhost:${PORT}/api`);
});
