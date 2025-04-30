import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const deleteContact = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = async (name, newObject) => {
  try {
    // Buscar la persona por nombre
    const getResponse = await axios.get(
      `${baseUrl}/name/${encodeURIComponent(name)}`
    );
    const id = getResponse.data.id;

    // Realizar la actualización utilizando el id obtenido
    const putResponse = await axios.put(`${baseUrl}/${id}`, newObject);
    return putResponse.data;
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    throw error;
  }
};

export default { getAll, create, deleteContact, update };
