const Persons = ({ person, deletePerson }) => (
  <div>
    <p>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </p>
  </div>
);

export default Persons;
