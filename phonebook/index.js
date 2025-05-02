const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());
const path = require("path");

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - Body: :body"
  )
);

const Person = require("./models/person");

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch(next);
});

app.get("/info", async (request, response, next) => {
  try {
    const count = await Person.countDocuments({});
    response.send(
      `<h2>Phonebook has info of ${count} people</h2> <br> <p>${new Date()}</p>`
    );
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        const err = new Error("Persona no encontrada");
        err.status = 404;
        return next(err);
      }
      response.json(person);
    })
    .catch(next);
});

app.get("/api/persons/name/:name", async (request, response, next) => {
  try {
    const person = await Person.findOne({ name: request.params.name });
    if (person) {
      response.json(person);
    } else {
      const err = new Error("Persona no encontrada");
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        const err = new Error("Persona no encontrada");
        err.status = 404;
        return next(err);
      }
      response.status(204).end();
    })
    .catch(next);
});

app.post("/api/persons", async (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    const err = new Error("Falta el nombre o el número");
    err.status = 400;
    return next(err);
  }

  try {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then((savedPerson) => response.json(savedPerson))
      .catch(next);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    const err = new Error("Faltan campos obligatorios");
    err.status = 400;
    return next(err);
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedPerson) {
      const err = new Error("Persona no encontrada");
      err.status = 404;
      return next(err);
    }

    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname, "dist")));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "ID malformado" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.status) {
    return response.status(error.status).json({ error: error.message });
  }

  // Fallback genérico para errores no manejados
  response.status(500).json({ error: "Error interno del servidor" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
