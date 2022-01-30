import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import styles from "../styles/Home.module.css"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid';


export default function Home() {

  const { user, error, isLoading } = useUser()

  const itemsFromBackend = [
    { id: uuid(), content: "First Dom" },
    { id: uuid(), content: "Second Dom" },
    { id: uuid(), content: "Third Dom" },
    { id: uuid(), content: "Fourth Dom" },
    { id: uuid(), content: "Fifth Dom" }
  ];


const columnsFromBackend = {
  [uuid()]: {
    name: "Public",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "Private",
    items: []
  },

};

const onCreate = (item) => {

}

const [columns, setColumns] = useState(columnsFromBackend);

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};
  if (!user) {
    return (
      <>
        <a href="api/auth/login">Login</a>
      </>
    )
  }

  console.log(user);
  return (
    <>
      <h1>Welcome {user.nickname}!</h1>
      <a href="/api/auth/logout">Logout</a>


      <section>
      <h1>Drag and Drop</h1>
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <button>Add Dom Element</button>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>


      </section>
    </>
  )

}
