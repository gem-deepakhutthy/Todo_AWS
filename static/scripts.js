async function loadTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = todo[1];
        li.setAttribute('data-id', todo[0]);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'ml-auto';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-primary mr-2';
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(todo[0], todo[1]);
        buttonContainer.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo[0]);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(buttonContainer);
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const task = document.getElementById('new-task').value;
    await fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
    });
    document.getElementById('new-task').value = '';
    loadTodos();
}

async function editTodo(id, currentTask) {
    const newTask = prompt('Edit task', currentTask);
    if (newTask) {
        await fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: newTask })
        });
        loadTodos();
    }
}

async function deleteTodo(id) {
    await fetch(`/todos/${id}`, { method: 'DELETE' });
    loadTodos();
}

window.onload = loadTodos;
