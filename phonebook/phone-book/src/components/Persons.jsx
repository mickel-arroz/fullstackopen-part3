import contact from "../services/contact";

const Persons = ({ findSearch, persons, setPersons, setError }) => {
  const handleDeleteButton = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      contact
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          alert("Contact deleted successfully");
        })
        .catch(() => {
          setError(
            `Information of ${
              persons.find((person) => person.id === id).name
            } has already been removed from server`
          );
        });
    }
  };

  return (
    <ul>
      {findSearch &&
        findSearch.map((person) => (
          <li key={person.id}>
            {person.name}: {person.number}
            <button onClick={() => handleDeleteButton(person.id)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;
