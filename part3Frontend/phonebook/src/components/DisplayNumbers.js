import DeleteButton from "./DeleteButton";

const DisplayNumbers = ({
  persons,
  setPersons,
  personsToShow,
  setPersonsToShow,
  setErrorMessage,
  setErrorCode,
}) => {
  let newPersonsToShow = personsToShow.map((person) => {
    return (
      <>
        <p>
          {person.name} {person.number}
        </p>
        <DeleteButton
          persons={persons}
          setPersons={setPersons}
          personsToShow={personsToShow}
          setPersonsToShow={setPersonsToShow}
          personId={person.id}
          setErrorMessage={setErrorMessage}      
          setErrorCode={setErrorCode}
        />
      </>
    );
  });

  return (
    <ul>
      {newPersonsToShow.map((person, index) => (
        <li key={personsToShow[index].id}>{person}</li>
      ))}
    </ul>
  );
};

export default DisplayNumbers;
