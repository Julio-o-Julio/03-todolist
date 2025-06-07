import { useEffect, useState } from 'react';
import axios from 'axios';
import Todos from './components/Todos';
import './styles/App.css';
import ModalAddTag from './components/ModalAddTag';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState(null);

  const [modalAddTag, setModalAddTag] = useState(null);

  const setSelectedTodo = (selectedTodo) => {
    if (todo === selectedTodo) {
      setTodo(null);
      setName('');
      setDescription('');
    } else {
      setTodo(selectedTodo);
      setName(selectedTodo.name);
      setDescription(selectedTodo.description);
    }
  };

  const createTodo = async () => {
    await axios.post('http://localhost:8080/todos', {
      name,
      description
    });

    getTodos();
    setName('');
    setDescription('');
  };

  const getTodos = async () => {
    const response = await axios.get('http://localhost:8080/todos');

    setTodos(response.data);
  };

  const deleteTodo = async (id) => {
    axios.delete(`http://localhost:8080/todos/${id}`);

    getTodos();
  };

  const modifyStatusTodo = async (todo) => {
    await axios.put('http://localhost:8080/todos', {
      id: todo.id,
      status: !todo.status
    });

    getTodos();
  };

  const editTodo = async () => {
    await axios.put('http://localhost:8080/todos', {
      id: todo.id,
      name,
      description
    });

    setTodo(null);
    setName('');
    setDescription('');
    getTodos();
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (!modalAddTag) getTodos();
  }, [modalAddTag]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (todo) editTodo();
    else createTodo();
  };

  return (
    <main>
      <header className="header">
        <h2>Minha lista de tarefas</h2>
      </header>

      <Todos
        todos={todos}
        deleteTodo={deleteTodo}
        modifyStatusTodo={modifyStatusTodo}
        setSelectedTodo={setSelectedTodo}
        setModalAddTag={setModalAddTag}
        setTodo={setTodo}
        getTodos={getTodos}
      />

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="name"
          type="text"
          value={name}
          placeholder={todo ? 'Alterar nome' : 'Nome da tarefa*'}
          onChange={(event) => {
            setName(event.target.value);
          }}
          required
        />
        <input
          className="input"
          name="description"
          type="text"
          value={description}
          placeholder={todo ? 'Adicionar descrição' : 'Descrição da tarefa'}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <button className="newTaskButton">
          {todo ? 'Alterar tarefa' : 'Adicionar tarefa'}
        </button>
      </form>

      {modalAddTag && (
        <ModalAddTag
          todo={todo}
          getTodos={getTodos}
          setModalAddTag={setModalAddTag}
        />
      )}
    </main>
  );
}

export default App;
