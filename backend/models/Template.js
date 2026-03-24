let templates = [];

app.post("/templates/create", (req, res) => {
  const { name, content } = req.body;

  const newTemplate = {
    id: Date.now(),
    name,
    content,
    status: "pending"
  };

  templates.push(newTemplate);
  res.json(newTemplate);
});