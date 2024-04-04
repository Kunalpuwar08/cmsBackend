const express = require("express");
const { verifyToken } = require("../common");
const Todo = require("../models/todosSchems");
const router = express.Router();

//------------------------Employeee-------------------------
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { userId, email, name, companyId, companyName } = req.user;
    const { title, date, description, estimationHours } = req.body;

    if (!title || !date || !description || !estimationHours) {
      return res.status(422).json({ error: "Please fill all required field" });
    }

    const data = {
      name,
      date,
      email,
      title,
      userId,
      status: "todo",
      companyId,
      description,
      companyName,
      estimationHours,
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

router.patch("/startTodo/:todoId", verifyToken, async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { todoId } = req.params;

    const startTime = Date.now();

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    let elapsedTime = 0; // Initialize elapsedTime to 0
    if (todo.isPaused && todo.pauseTime) {
      // If the todo was paused, calculate the elapsed time
      elapsedTime = startTime - todo.pauseTime;
    }

    const remainingHours =
      todo.estimationHours - elapsedTime / (1000 * 60 * 60);

    const updatedData = {
      userId,
      status: "In progress",
      companyId,
      startTime: startTime - elapsedTime,
      isPaused: false,
    };

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData, {
      new: true,
    });

    updatedTodo.pauseTime = null;
    if (remainingHours <= 0) {
      updatedTodo.status = "Completed";
      await updatedTodo.save();
    }

    res.status(200).json({ message: "Todo Started successfully" });
  } catch (error) {
    console.error("Error updating Todo:", error);
    res
      .status(500)
      .json({ error: "Error updating Todo", message: error.message });
  }
});

router.patch("/pauseTodo/:todoId", verifyToken, async (req, res) => {
  try {
    const { todoId } = req.params;

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (todo.status === "Completed") {
      return res.status(400).json({ error: "Todo is already completed" });
    } else if (todo.isPaused) {
      return res.status(400).json({ error: "Todo is already paused" });
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - todo.startTime;

    const remainingHours =
      todo.estimationHours - elapsedTime / (1000 * 60 * 60);

    const remainingSeconds = remainingHours * 3600;

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);

    const Etime = `${hours}:${minutes}:${seconds}`;

    todo.isPaused = true;
    todo.remainingHours = remainingHours;
    todo.pauseTime = Date.now();
    await todo.save();

    res.status(200).json({
      message: "Todo paused successfully",
      remainingHours: remainingHours,
      Etime: Etime,
    });
  } catch (error) {
    console.error("Error pausing Todo:", error);
    res
      .status(500)
      .json({ error: "Error pausing Todo", message: error.message });
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

router.get("/admin-todo-list", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

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
      const { _id, todos } = employee;

      employeesWithTodos.push({ userId: _id, name: todos[0].name, todos });
    });

    res.json(employeesWithTodos);
  } catch (error) {
    console.log(error, "Error in fetching todo");
    res.status(500).json({ error: "Error in fetching todo" });
  }
});

module.exports = router;
