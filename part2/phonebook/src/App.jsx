import { useState, useEffect } from 'react'
import person from './services/person'
import './index.css'
const Filter = ({ search, handleSearch }) => {
  return (
            <div>
        filter shown with <input value={search} onChange={handleSearch}/>
        </div>
    )

}
const PersonForm = (props) => {
  return (
<form onSubmit={props.AddNote}>
        <div>
          name: <input value={props.newName} onChange={props.handleNewName} required/>
        </div>
        <div>
          number: <input value={props.number} onChange={props.handleNumber} required/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}
const Persons = (props) => {
  return (
    <>
      <table>
        <tbody>
          
      {props.filterArray.map(person =>
        <tr key={person.id}>
          <td><p>{person.name}</p></td>
          <td><p>{person.number}</p></td>
          <td><button onClick={() => props.removePerson(person.id)}>delete</button></td>
        </tr>
      )}
        </tbody>
      </table>
    </>
    )
}
const Notification = ({ message }) => {
  console.log(message)
    if (message === null) {
      return null;
    }
    return (
      <div className="notification">
        {message}
      </div>
      )
  }
const App = () => {
  const [persons, setPersons] = useState([])
 const baseUrl = 'http://localhost:3001/persons'
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    person.getAll().then(initialData => setPersons(initialData))
    }, [])
  
const AddNote = (event) => {
  event.preventDefault();
  if (persons.some(person => person.name === newName && person.number === number)) {
    alert(`${newName} or/and ${number} is/are already exist`);
    return;
  } else if (persons.some(person => person.name === newName)){
    const findPerson = persons.find(person => person.name === newName)
    const changedPerson = { ...findPerson, number: number}
    person.update(findPerson.id, changedPerson).then(updatedValue => {
      setPersons(persons.map(person => person.id === findPerson.id ? updatedValue : person))
      setMessage(`${findPerson.name}'s phone number changed`)
      console.log(message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }).catch(error => {
      setMessage(`information of ${findPerson.name} has already been removed from the server`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  } else {
  
  const nameObject = { 
    name: newName,
    number: number,
    
  };
  person.create(nameObject).then(newPerson => {
    setPersons(persons.concat(newPerson));
  });


  }
  setNewName('');
  setNumber('');  

}
const handleNewName = (event) => {
  setNewName(event.target.value)
}
const handleNumber = (event) => {
  setNumber(event.target.value)
}

const handleSearch = (event) => {
  const searchValue = event.target.value
  setSearch(searchValue)
  }
  const filterArray = persons.filter(person => 
  person.name.toLowerCase().includes(search.toLowerCase())
);
const RemovePerson = (id) => {
  const userConfirmed = window.confirm("Are you sure you want to delete this item?")
  if (userConfirmed) {
  person.remove(id).then(removeName => {
    const updatedPerson = persons.filter(person => person.id !== id)
    setPersons(updatedPerson)  })
  }
}
  return (
    <div>
      <Notification message={message} />
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h3>add a new</h3>
      <PersonForm
      AddNote={AddNote}
      newName={newName}
      handleNewName={handleNewName}
      number={number}
      handleNumber={handleNumber}
      />
      
      <h3>Numbers</h3>
      <Persons filterArray={filterArray} removePerson={RemovePerson}/>
    </div>
  )
}

export default App