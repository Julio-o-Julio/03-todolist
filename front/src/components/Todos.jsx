import SpanTags from './SpanTags';

const Todos = ({
  todos,
  deleteTodo,
  modifyStatusTodo,
  setSelectedTodo,
  setModalAddTag,
  setTodo,
  getTodos
}) => {
  return (
    <section className="todos">
      {todos.map((todo) => {
        return (
          <div key={todo.id} className="todo">
            <button
              className={`checkbox ${todo.status ? 'active' : ''}`}
              onClick={() => modifyStatusTodo(todo)}
            ></button>

            <article className="todoTextBox">
              <p className="todoName">{todo.name}</p>
              {todo.description && (
                <p className="todoDescription">{todo.description}</p>
              )}
            </article>

            <SpanTags todo={todo} getTodos={getTodos} />

            <button
              className="buttonsTodo"
              title="Adicionar tags"
              onClick={() => {
                setModalAddTag(true);
                setTodo(todo);
              }}
            >
              <img src="/plus-svg.svg" alt="Adicionar tags" />
            </button>
            <button
              className="buttonsTodo"
              title="Editar tarefa"
              onClick={() => setSelectedTodo(todo)}
            >
              <img src="/edit-svg.svg" alt="Editar tarefa" />
            </button>
            <button
              className="buttonsTodo"
              title="Apagar tarefa"
              onClick={() => deleteTodo(todo.id)}
            >
              <img src="/delete-svg.svg" alt="Apagar tarefa" />
            </button>
          </div>
        );
      })}
    </section>
  );
};

export default Todos;
