const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  
  return res.json(repositories);
  
});

function validateProjectId( req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid Projec ID' });
  }

  return next();
}

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
 
  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };
  
  repositories.push(repository);

  return res.json(repository)
});

app.put("/repositories/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  const { likes } = repositories.find(repository => repository.id == id );
  
  if (repositoryIndex < 0) {
      return res.status(400).json({ error: 'Repository not found!'})
  }

  const modRepository  = { id, title, url, techs, likes };

  repositories[repositoryIndex] = modRepository ;

  return res.json(modRepository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

   if (repositoryIndex < 0) {
     return res.status(400).json({ error: 'Repository not found!'})
   }  

    repositories.splice(repositoryIndex,1);

    return res.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (req, res) => {
  const { id } = req.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  const repository = repositories.find(repository => repository.id == id );
  
  if (repositoryIndex < 0) {
      return res.status(400).json({ error: 'Repository not found!'})
  }

  repository.likes += 1


  repositories[repositoryIndex] = repository ;

  return res.json(repository);
});

module.exports = app;
