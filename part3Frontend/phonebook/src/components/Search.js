import { useState} from "react";

const Search = (props) => {
  const setPersonsToShow = props.setPersonsToShow;
  const [searchQuery, setSearchQuery] = useState("");
  const persons = props.persons;

  const searchPerson = (event) => {
    let matchedPersons = persons.filter((person) => {
      const personUpperCase = person.name.toUpperCase();
      const searchQueryUpperCase = event.target.value.toUpperCase();
      return personUpperCase.includes(searchQueryUpperCase);
    });
    setPersonsToShow(matchedPersons);
    setSearchQuery(event.target.value);
  };
  return <input value={searchQuery} onChange={searchPerson} />;
};

export default Search;
