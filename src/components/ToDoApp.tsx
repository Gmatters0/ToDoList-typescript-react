import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import "./ToDoApp.css"

interface ToDoItem {
  id: string;
  text: string;
  completed: boolean;
}

function ToDoApp() {
  const memoryTasksKey = "tasks"
  const { theme, toggleTheme } = useTheme()
  const [toDos, setToDos] = useState<ToDoItem[]>([])
  const [newToDo, setNewToDo] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const addTask = (): void => {
    if(newToDo !== "") {
      const newId = crypto.randomUUID()
      const newToDoItem: ToDoItem = {
        id: newId,
        text: newToDo,
        completed: false
      }
      setToDos([...toDos, newToDoItem])
      setNewToDo("")
    }
  }

  const removeTask = (id: string): void => {
    const updatedToDos = toDos.filter((toDo) => toDo.id !== id)
    setToDos(updatedToDos)
  }

  const checkComplete = (id: string): void => {
    const updatedToDos = toDos.map((toDo) => {
      if (toDo.id === id){
        return { ...toDo, completed: !toDo.completed}
      }
      return toDo
    })
    setToDos(updatedToDos)
  }
  const completedTasks = (): ToDoItem[] => {
    return toDos.filter(toDo => toDo.completed)
  }

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem(memoryTasksKey, JSON.stringify(toDos))
    }
  }, [toDos, isLoaded])

  useEffect(() => {
    const memoryTasks = localStorage.getItem(memoryTasksKey)
    if(memoryTasks) {
      setToDos(JSON.parse(memoryTasks))
    }
    setIsLoaded(true)
  }, [])

  return (
    <div className={`app ${theme}`}>
      <div className={`container ${theme}`}>
        <h1>Lista de Tarefas</h1>
        <div className='input-container'>
          <input type='text' value={newToDo} onChange={(e) => setNewToDo(e.target.value)} />
          <button onClick={addTask}>Adicionar Tarefa</button>
        </div>
        <ol>
          {
            toDos.map((toDo) => (
              <li key={toDo.id}>
                <input type='checkbox' checked={toDo.completed} onChange={() => checkComplete(toDo.id)} />
                <span style={{ textDecoration: toDo.completed ? 'line-through' : 'none'}}>{toDo.text}</span>
                <button onClick={() => removeTask(toDo.id)}>X</button>
              </li>
            ))
          }
        </ol>
        <div className='app-footer'>
          <button onClick={toggleTheme}>
            Alterar para o tema { theme === 'light' ? 'Escuro' : 'Claro'}
          </button>
          <p>Tarefas {completedTasks().length}/{toDos.length}</p>
        </div>  
      </div>
    </div>
  )
}

export default ToDoApp