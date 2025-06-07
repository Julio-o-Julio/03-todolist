import { useEffect, useState } from 'react';
import Tags from './Tags';
import axios from 'axios';

const ModalAddTag = ({ todo, getTodos, setModalAddTag }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(null);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);

  const setSelectedTag = (selectedTag) => {
    if (tag === selectedTag) {
      setTag(null);
      setName('');
      setColor(null);
    } else {
      setTag(selectedTag);
      setName(selectedTag.name);
      setColor(selectedTag.color);
    }
  };

  const createTag = async () => {
    await axios.post('http://localhost:8080/tags', {
      name
    });

    getTags();
    setName('');
    setColor(null);
  };

  const getTags = async () => {
    const response = await axios.get('http://localhost:8080/tags');

    setTags(response.data);
  };

  const deleteTag = async (id) => {
    await axios.delete(`http://localhost:8080/tags/${id}`);

    getTags();
  };

  const editTag = async () => {
    if (tag) {
      await axios.put(`http://localhost:8080/tags`, {
        id: tag.id,
        name,
        color,
        todoId: todo.id
      });

      setTag(null);
      setName('');
      setColor(null);
      getTags();
      getTodos();
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) setModalAddTag(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (tag) editTag();
    else createTag();
  };

  return (
    <section className="modalContainer" onClick={handleOutsideClick}>
      <article className="modalContent">
        <h3>Adicionar Tags</h3>

        <Tags
          tags={tags}
          deleteTag={deleteTag}
          setSelectedTag={setSelectedTag}
          getTags={getTags}
          todo={todo}
          setModalAddTag={setModalAddTag}
        />

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="name"
            type="text"
            value={name}
            placeholder={tag ? 'Alterar nome' : 'Nome da tag*'}
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
          />

          <button className="newTaskButton">
            {tag ? 'Alterar tag' : 'Adicionar tag'}
          </button>
        </form>
      </article>
    </section>
  );
};

export default ModalAddTag;
