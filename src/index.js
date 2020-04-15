const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const logRequest = (request, response, next) => {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase(method)}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
};

const validateId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Project id is invalid." });
  }
  next();
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use("/projects/:id", validateId);

const projects = [];

app.get("/projects", (request, response) => {
  const { name } = request.query;

  const results = name
    ? projects.filter((project) => project.name.includes(name))
    : projects;

  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { name, owner } = request.body;
  const project = {
    id: uuid(),
    name,
    owner,
  };

  projects.push(project);

  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { name, owner } = request.body;

  const index = projects.findIndex((project) => project.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "project not found." });
  }

  const project = {
    id,
    name,
    owner,
  };

  projects[index] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const index = projects.findIndex((project) => project.id === id);
  projects.splice(index, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("🚀 Back-end started!");
});
