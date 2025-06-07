import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const SpanTags = ({ todo, getTodos }) => {
  const [tags, setTags] = useState([]);

  const getTagsInTodo = useCallback(async () => {
    if (todo) {
      const response = await axios.get(`http://localhost:8080/tags/${todo.id}`);
      setTags(response.data);
    }
  }, [todo]);

  const deleteRelationTagTodo = async (tag) => {
    if (tag && todo) {
      await axios.delete(
        `http://localhost:8080/tag-todos/${tag.id}/${todo.id}`
      );

      getTodos();
    }
  };

  useEffect(() => {
    getTagsInTodo();
  }, [getTagsInTodo]);

  if (tags.length > 0) {
    if (tags.length === 1) {
      return (
        <span id="spanTags" className="spanTags">
          {tags.map((tag) => {
            return (
              <div
                key={tag.id}
                className="spanTag"
                style={{ backgroundColor: tag.color }}
                title={`Click para remover esta tag da tarefa`}
                onClick={() => deleteRelationTagTodo(tag)}
              >
                {tag.name}
              </div>
            );
          })}
        </span>
      );
    } else {
      return (
        <span id="spanTags" className="spanTags">
          {tags.map((tag) => {
            return (
              <div
                key={tag.id}
                className="spanTag"
                style={{ backgroundColor: tag.color }}
                title={`${
                  'Tag: ' + tag.name + ' | '
                } Click para remover esta tag da tarefa`}
                onClick={() => deleteRelationTagTodo(tag)}
              ></div>
            );
          })}
        </span>
      );
    }
  } else return <span></span>;
};

export default SpanTags;
