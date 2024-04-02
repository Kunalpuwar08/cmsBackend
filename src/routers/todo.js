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

    const existingTodo = await Todo.findOne({ userId, date });

    if (existingTodo) {
      return res
        .status(400)
        .json({ error: "A Todo already exists for this date" });
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
    const { title, description, status } = req.body;
    const { todoId } = req.params;

    if (!title || !description) {
      return res.status(422).json({ error: "Please fill all required fields" });
    }

    const updatedData = {
      userId,
      title,
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
    res
      .status(500)
      .json({ error: "Error updating Todo", message: error.message });
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
// router.get("/admin-todo-list", verifyToken, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const todo = await Todo.find({ companyId: userId });

//     if (!todo) {
//       return res.status(404).json({ error: "Todo not found" });
//     }

//     res.json(todo);
//   } catch (error) {
//     console.log(error, "Error in fetching todo");
//     res.status(500).json({ error: "Error in fetching todo" });
//   }
// });

router.get("/admin-todo-list", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Aggregate pipeline to group todo items by employee
    const todosByEmployee = await Todo.aggregate([
      {
        $match: { companyId: userId },
      },
      {
        $group: {
          _id: "$userId",
          todos: { $push: "$$ROOT" },
        },
      },
    ]);
    const employeesWithTodos = [];

    todosByEmployee.forEach((employee) => {
      const { _id, name, todos } = employee;
      console.log(employee);
      employeesWithTodos.push({ userId: _id, name: todos[0].name, todos });
    });

    res.json(employeesWithTodos);
  } catch (error) {
    console.log(error, "Error in fetching todo");
    res.status(500).json({ error: "Error in fetching todo" });
  }
});

module.exports = router;
