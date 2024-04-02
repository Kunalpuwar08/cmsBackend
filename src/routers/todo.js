const express = require("express");
const { verifyToken } = require("../common");
const Todo = require("../models/todosSchems");
const router = express.Router();

//------------------------Employeee-------------------------
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { userId, email, name, companyId, companyName } = req.user;
    const { title, date, description, status } = req.body;

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
      status,
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

router.patch("/update/:todoId", verifyToken, async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { title, date, description, status } = req.body;
    const { todoId } = req.params;

    if (!title || !date || !description) {
      return res.status(422).json({ error: "Please fill all required fields" });
    }

    const updatedData = {
      userId,
      title,
      date,
      description,
      status,
      companyId,
    };

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData);

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating Todo:", error);
    res.status(500).json({ error: "Error updating Todo", message: error.message });
  }
});


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
