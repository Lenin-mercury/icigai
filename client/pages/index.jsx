import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { v4 as uuid } from "uuid"
import { userService } from "services"
import itemsFromDB from "../data/users.json"

export default Home

function Home() {
  //user auth
  const { user } = useUser()
  if (!user) {
    return (
      <>
        <h1>Login to continue</h1>
      </>
    )
  }

//   display all public arrays here

//   const publicArray = []
//   itemsFromDB.map((item) => {
//     console.log(item)
//     item.map((list) => {
//       console.log(list)
//     })
//     return item
//   })

//   console.log(publicArray)

  const [currentUser, setCurrentUser] = useState(
    itemsFromDB.find((x) => x.email === user.email)
  )

  const columnsFromBackend = {
    [uuid()]: {
      name: "Public",
      //public items should go here all files in itemsfromDB
      items: currentUser === null ? [] : currentUser.publicItems,
    },
    [uuid()]: {
      name: "Private",
      items: currentUser === null ? [] : currentUser.privateItems,
    },
  }
  const [columns, setColumns] = useState(columnsFromBackend)

  const [pubtoggle, setPubToggle] = useState(false)

  useEffect(() => {
    userService.getAll().then((data) => {
      const foundUser = data.find((x) => x.email === user.email)
      setCurrentUser(foundUser)
      setColumns(columnsFromBackend)
      return foundUser
    })
  }, [pubtoggle])

  console.log(pubtoggle)

  const [formData, setFormdata] = useState({
    publicValue: "",
    privateValue: "",
  })

  const onhandleChange = (e) =>
    setFormdata({ ...formData, [e.target.name]: e.target.value })

  const { publicValue, privateValue } = formData

  const onPrivateCreate = (e) => {
    e.preventDefault()
    const body = {
      value: privateValue,
      email: user.email,
      isprivate: true,
    }
    userService.updateItems(currentUser.id, body)
    setFormdata({
      publicValue: "",
      privateValue: "",
    })
  }
  const onPublicCreate = (e) => {
    e.preventDefault()
    const body = {
      value: publicValue,
      email: user.email,
      isprivate: false,
    }
    userService.updateItems(currentUser.id, body)
    setFormdata({
      publicValue: "",
      privateValue: "",
    })
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }
  return (
    <div>
      <h1>User Task</h1>
      <section>
        <h1>Drag and Drop</h1>
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  key={columnId}
                >
                  <h2>{column.name}</h2>

                  {(column.name === "Public" && (
                    <>
                      <form onSubmit={onPublicCreate}>
                        <input
                          type="text"
                          onChange={(e) => onhandleChange(e)}
                          value={publicValue}
                          name="publicValue"
                        />
                        <button
                          className="btn btn-dark"
                          onClick={() => setPubToggle(!pubtoggle)}
                        >
                          Add To Public
                        </button>
                      </form>
                    </>
                  )) ||
                    (column.name === "Private" && (
                      <>
                        <form onSubmit={onPrivateCreate}>
                          <input
                            type="text"
                            onChange={(e) => onhandleChange(e)}
                            value={privateValue}
                            name="privateValue"
                          />
                          <button
                            className="btn btn-dark"
                            onClick={() => setPubToggle(!pubtoggle)}
                          >
                            Add To Private
                          </button>
                        </form>
                      </>
                    ))}
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
                              minHeight: 500,
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
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        {item.value}
                                      </div>
                                    )
                                  }}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        )
                      }}
                    </Droppable>
                  </div>
                </div>
              )
            })}
          </DragDropContext>
        </div>
      </section>
    </div>
  )
}
