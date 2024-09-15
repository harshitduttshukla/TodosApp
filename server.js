const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Updated port

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

let users = {  
    1: { 
        todos: []
    },
    2: { 
        todos: []
    }
};

// Function to load users from the file
function loadUsers() {
    const filePath = path.join(__dirname, 'todos.txt');
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            if (data.trim() === '') {
                // File is empty, initializing with default data
                users = {
                    1: { todos: [] },
                    2: { todos: [] }
                };
            } else {
                users = JSON.parse(data);
            }
        } catch (err) {
            console.error('Failed to load users from file:', err);
            users = {
                1: { todos: [] },
                2: { todos: [] }
            };
        }
    } else {
        users = {
            1: { todos: [] },
            2: { todos: [] }
        };
    }
}

// Function to save users to the file
function saveUsers() {
    fs.writeFile(path.join(__dirname, 'todos.txt'), JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Failed to save users to file:', err);
        }
    });
}

// Route to get a specific todo for a specific user
app.get('/users/:id/todos/:todoId', (req, res) => {
    const userId = Number(req.params.id);
    const todoId = Number(req.params.todoId);

    if (users[userId]) {
        const todo = users[userId].todos.find(t => t.id === todoId);
        if (todo) {
            res.json({ title: todo.title });

            const data = `User ${userId} - Todo ${todoId}: ${todo.title}\n`;
            fs.appendFile('todos.txt', data, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log('Todo data saved to todos.txt');
                }
            });
        } else {
            res.status(404).send('Todo not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});

// Route to add a new todo for a specific user
app.post('/users/:id/todos', (req, res) => {
    const userId = req.params.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).send('Title is required');
    }

    if (users[userId]) {
        const newTodo = { id: users[userId].todos.length + 1, title };
        users[userId].todos.push(newTodo);

        saveUsers();

        res.status(201).json(newTodo);
        console.log(newTodo);
    } else {
        res.status(404).send('User not found');
    }
});

// Route to delete a specific todo for a specific user
app.delete('/users/:id/todos/:todoId', (req, res) => {
    const userId = req.params.id;
    const todoId = parseInt(req.params.todoId);

    if (users[userId]) {
        const todoIndex = users[userId].todos.findIndex(todo => todo.id === todoId);

        if (todoIndex !== -1) {
            users[userId].todos.splice(todoIndex, 1);

            saveUsers();

            res.status(204).send({
                message: "Todo is deleted"
            });
        } else {
            res.status(404).send('Todo not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});

// Route to update a specific todo for a specific user
app.put('/users/:id/todos/:todoId', (req, res) => {
    const userId = req.params.id;
    const todoId = parseInt(req.params.todoId);
    const { title } = req.body;

    // Debugging logs
    console.log(`UserID: ${userId}, TodoID: ${todoId}, New Title: ${title}`);

    if (!title) {
        return res.status(400).send('Title is required');
    }

    if (users[userId]) {
        const todo = users[userId].todos.find(todo => todo.id === todoId);

        if (todo) {
            todo.title = title;

            saveUsers();

            res.json(todo);
        } else {
            res.status(404).send('Todo not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});

// Load initial data and start the server
loadUsers();
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
