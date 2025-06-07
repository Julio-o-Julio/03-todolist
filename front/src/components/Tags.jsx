import { useState } from 'react';
import axios from 'axios';

const Tags = ({
  tags,
  deleteTag,
  setSelectedTag,
  getTags,
  todo,
  setModalAddTag
}) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const handleTagTodo = async (tag) => {
    if (tag && todo) {
      await axios.post('http://localhost:8080/tag-todos', {
        tagId: tag.id,
        todoId: todo.id
      });

      getTags();
      setModalAddTag(null);
    }
  };

  const modifyColorTag = async (tag, color) => {
    if (tag) {
      await axios.put(`http://localhost:8080/tags`, {
        id: tag.id,
        name: tag.name,
        color
      });

      getTags();
    }
  };

  const handleColorChange = (tag, newColor) => {
    // Limpa o timeout existente
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Configura um novo timeout para chamar a função depois de meio segundo (500 ms)
    const newTimeoutId = setTimeout(() => {
      modifyColorTag(tag, newColor);
    }, 500);

    // Atualiza a variável de estado com o novo Id de timeout
    setTimeoutId(newTimeoutId);
  };

  return (
    <section className="tags">
      {tags &&
        tags.map((tag) => {
          return (
            <div key={tag.id} className="tag">
              <input
                type="color"
                title="Trocar cor"
                value={tag.color}
                className="inputColor"
                onChange={(event) => handleColorChange(tag, event.target.value)}
              />

              <article
                className="tagTextBox"
                title="Adicionar esta tag a tarefa"
                onClick={() => handleTagTodo(tag)}
              >
                <p className="todoName">{tag.name}</p>
                <p className="todoDescription">Cor: {tag.color}</p>
              </article>

              <button
                className="buttonsTodo"
                title="Editar tag"
                onClick={() => setSelectedTag(tag)}
              >
                <img src="/edit-svg.svg" alt="Editar tag" />
              </button>
              <button
                className="buttonsTodo"
                title="Apagar tag"
                onClick={() => deleteTag(tag.id)}
              >
                <img src="/delete-svg.svg" alt="Apagar tag" />
              </button>
            </div>
          );
        })}
    </section>
  );
};

export default Tags;
