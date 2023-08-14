const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

// Middleware to parse JSON in request body
app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
   res.json(users);
});

app.post('/users', async (req, res) => {
   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = { name: req.body.name, password: hashedPassword };
      users.push(user);
      res.status(201).send();
   } catch (error) {
      res.status(500).send();
   }
});

app.post('/login', async (req, res) => {
   const user = users.find(user => user.name === req.body.name);
   if (user) {
      try {
         if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Login successful');
         } else {
            res.send('Login failed');
         }
      } catch (error) {
         res.status(500).send();
      }
   } else {
      res.send('User not found');
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
