import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getPhoneNumbers = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addPerson = (personObject) => {
  return axios.post(baseUrl, personObject).then((response) => response.data);
};

const editNumber = (id, personObject) => {
  return axios
    .put(baseUrl + "/" + id, personObject)
    .then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(baseUrl + "/" + id)
};

export default { getPhoneNumbers, addPerson, editNumber, deletePerson};