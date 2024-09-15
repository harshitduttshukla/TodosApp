document.getElementById('add-todo-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const userId = document.getElementById('user-id').value;
    const title = document.getElementById('todo-title').value;

    fetch(`/users/${userId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    })
    .then(response => response.json())
    .then(data => {
        alert('Todo added: ' + JSON.stringify(data));
        document.getElementById('todo-title').value = '';
    })
    .catch(error => console.error('Error:', error));
});


//--------------------------------------------------------------------------------------------







function fetchTodos() {
    const userId = document.getElementById('fetch-user-id').value;

    fetch(`/users/${userId}/todos/`)
    .then(response => response.json())
    .then(todos => {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = `ID: ${todo.id}, Title: ${todo.title}`;
            console.log(todo.title);
            
            todoList.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('update-todo-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const userId = document.getElementById('update-user-id').value;
    const todoId = document.getElementById('update-todo-id').value;
    const title = document.getElementById('update-title').value;

    fetch(`/users/${userId}/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    })
    .then(response => response.json())
    .then(data => {
        alert('Todo updated: ' + JSON.stringify(data));
        document.getElementById('update-title').value = '';
    })
    .catch(error => console.error('Error:', error));
});


//-------------------------------------------------------------------------------------
document.getElementById('delete-todo-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const userId = document.getElementById('delete-user-id').value;
    const todoId = document.getElementById('delete-todo-id').value;

    fetch(`/users/${userId}/todos/${todoId}`, {
        method: 'DELETE'
    })
    .then(() => {
        alert('Todo deleted');
    })
    .catch(error => console.error('Error:', error));
});
