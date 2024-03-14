const express = require("express");
const { verifyToken } = require("../common");
const Todo = require("../models/todosSchems");
const router = express.Router();


//------------------------Employeee-------------------------

//create TODO Employee
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { userId, email, role, name, companyId, companyName } = req.user;
    const { title, date, description } = req.body;

    if (!title || !date || !description) {
      return res.status(422).json({ error: "Please fill all required field" });
    }

    const data = {
      userId,
      email,
      name,
      title,
      date,
      description,
      status: "todo",
      companyId,
      companyName,
    };

    const Todos = new Todo(data);
    Todos.save()
      .then(() => {
        res.status(201).json({ message: "Todo created successfully" });
      })
      .catch(() => {
        res.status(500).json({ error: "Todo not created" });
      });
  } catch (error) {
    console.log(error, "Error in todo list");
  }
});

//list of created TODOS For Employee with ID
router.get("/list-todo", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const todo = await Todo.find({ userId });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    console.log(error, "Error in fetching todo");
    res.status(500).json({ error: "Error in fetching todo" });
  }
});

//delete Todo by id
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    const todo = await Todo.findOne({ _id: id });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await Todo.deleteOne({ _id: id });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error, "Error in deleting todo");
    res.status(500).json({ error: "Error in deleting todo" });
  }
});

//------------------------Admin--------------------------------



module.exports = router;
