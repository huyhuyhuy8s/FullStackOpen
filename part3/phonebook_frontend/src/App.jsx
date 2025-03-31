import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import personsServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notification, setNotification] = useState({});

  useEffect(() => {
    personsServices.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    let check = false;

    persons.map((person) => {
      if (person.name === newName) {
        if (
          window.confirm(
            `${person.name} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          const changedPerson = {
            ...person,
            number: newNumber,
          };

          personsServices
            .update(person.id, changedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.name === newName ? returnedPerson : person
                )
              );
              setNewName("");
              setNewNumber("");
            })
            .catch(() => {
              setNotification({
                message: `Information of ${
                  persons.find((person) => person.id === changedPerson.id).name
                } has already been removed from server`,
                code: 404,
              });
            });
        }
        check = true;
      }
    });

    if (!check) {
      personsServices
        .create(nameObject)
        .then((returnedPerson) => {
          setNotification({
            message: `Added ${returnedPerson.name}`,
            code: 200,
          });
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setNotification({
            message: error.message,
            code: 404,
          });
          console.log(error.response.data.error);
        });
    } else {
      check = !check;
    }
    // setPersons([...persons, nameObject]);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const deletePersonOf = (id) => {
    if (
      window.confirm(
        `Delete ${persons.find((person) => person.id === id).name}?`
      )
    )
      personsServices
        .del(id)
        .then((returnedPerson) => {
          setPersons(
            persons.filter((person) => person.id !== returnedPerson.id)
          );
        })
        .catch(() => {
          setNotification({
            message: `Information of ${
              persons.find((person) => person.id === id).name
            } has already been removed from server`,
            code: 404,
          });
        });
  };

  const personsToShow =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} code={notification.code} />
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      {personsToShow.map((person) => {
        return (
          <Persons
            key={person.id}
            person={person}
            deletePerson={() => deletePersonOf(person.id)}
          />
        );
      })}
    </div>
  );
};

export default App;
