const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());
const path = require("path");
app.use(express.static(path.join(__dirname, "dist")));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - Body: :body"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

const Person = require("./models/person");

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", async (request, response) => {
  const count = await Person.countDocuments({});

  response.send(
    `<h2>Phonebook has info of ${count} people</h2> <br> <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.get("/api/persons/name/:name", async (request, response) => {
  try {
    const person = await Person.findOne({ name: request.params.name });
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: "Persona no encontrada" });
    }
  } catch (error) {
    response.status(500).json({ error: "Error al buscar la persona" });
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const deletedPerson = await Person.findByIdAndDelete(id);
  if (!deletedPerson) {
    return response.status(404).json({ error: "Persona no encontrada" });
  }
  response.status(204).end();
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const existingPerson = await Person.exists({ name: body.name });

  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", async (request, response) => {
  const { name, number } = request.body;

  // Validar que se proporcionen ambos campos
  if (!name || !number) {
    return response.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      {
        new: true, // Devuelve el documento actualizado
        runValidators: true, // Aplica las validaciones del esquema
        context: "query", // Necesario para que runValidators funcione correctamente
      }
    );

    if (!updatedPerson) {
      return response.status(404).json({ error: "Persona no encontrada" });
    }

    response.json(updatedPerson);
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    response
      .status(400)
      .json({ error: "ID inválido o error en la actualización" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
