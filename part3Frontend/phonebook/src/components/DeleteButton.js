import phoneBook from "../services/phoneBook";

const DeleteButton = ({
  persons,
  setPersons,
  personsToShow,
  setPersonsToShow,
  personId,
  setErrorMessage,
  setErrorCode,
}) => {
  const deletePerson = () => {
    if (window.confirm("Are you sure you want to delete this contact")) {
      phoneBook
        .deletePerson(personId)
        .then(() => {
          setErrorMessage("Succesfully deleted");
          setErrorCode(0);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch(() => {
          setErrorMessage("Failed to delete person");
          setErrorCode(1);
          setTimeout(() => {
            setErrorMessage(null);
            setErrorCode(0);
          }, 5000);
        });
      let newPersonsToShow = [...personsToShow];
      let newPersons = [...persons];
      newPersons = newPersons.filter((person) => person.id !== personId);
      newPersonsToShow = newPersonsToShow.filter(
        (person) => person.id !== personId
      );
      setPersons(newPersons);
      setPersonsToShow(newPersonsToShow);
    }
  };

  return <button onClick={deletePerson}>Delete person</button>;
};

export default DeleteButton;
