import contact from "../services/contact";

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newPhone,
  setNewPhone,
  setMessage,
}) => {
  const handleSubmitAddName = (event) => {
    event.preventDefault();
    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        contact
          .update(persons.find((person) => person.name === newName).id, {
            name: newName,
            number: newPhone,
          })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.name === response.name
                  ? { ...person, number: newPhone }
                  : person
              )
            );
            setNewName("");
            setNewPhone("");

            setMessage(`Updated ${response.name}'s number to ${newPhone}`);

            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            alert("Error updating contact:", error);
          });
      }
    } else {
      contact
        .create({
          name: newName,
          number: newPhone,
        })
        .then((response) => {
          setPersons(persons.concat(response));
          setPersons([
            ...persons,
            { name: newName, number: newPhone, id: response.id },
          ]);

          setNewName("");
          setNewPhone("");

          setMessage(`Added ${response.name}`);

          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          alert("Error adding contact:", error);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  return (
    <form onSubmit={handleSubmitAddName}>
      <div>
        Nombre:{" "}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        Number:{" "}
        <input
          value={newPhone}
          onChange={handlePhoneChange}
        />
      </div>
      <div>
        <button type="submit">Agregar</button>
      </div>
    </form>
  );
};

export default PersonForm;
