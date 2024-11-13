const { v4: uuidv4 } = require("uuid");

//Create the new todo
exports.createTodo = async (req, res) => {
  const db = req.app.get("db");
  const { title, status } = req.body;
  const todoId = uuidv4();

  //Checking all the fields are provided
  if (!title || !status) {
    return res.status(400).json({
      error: "Title and Status are required to create a todo.",
    });
  }

  try {
    //Creating the todo
    await db.run(
      `INSERT INTO todos (id, userId, title, status) VALUES (?, ?, ?, ?)`,
      [todoId, req.user.userId, title, status]
    );
    return res.status(201).json({
      message: "Todo created successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Falied to create todo. Please try again." });
  }
};

//Get all the todos
exports.getTodos = async (req, res) => {
  const db = req.app.get("db");
  try {
    const todos = await db.all(`SELECT * FROM todos WHERE userId = ?`, [
      req.user.userId,
    ]);

    //checking if the todos exits
    if (todos.length === 0) {
      return res.status(404).json({
        message: "No todos yet!",
      });
    }

    //sending response to the user
    return res.status(200).json({
      todos,
    });
  } catch (error) {
    return res
      .status(200)
      .json({ error: "Falied to retrieve todos. Please try again." });
  }
};

// Update an existing Todo
exports.updateTodo = async (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const { title, status } = req.body;

  if (!title && !status) {
    return res.status(400).json({
      error: "At least one of title or status must be provided to update.",
    });
  }

  try {
    // Check if the todo exists for the user
    const todo = await db.get(
      `SELECT * FROM todos WHERE id = ? AND userId = ?`,
      [id, req.user.userId]
    );

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found for this user.",
      });
    }

    // Update title and/or status
    await db.run(
      `UPDATE todos SET title = COALESCE(?, title), status = COALESCE(?, status) WHERE id = ? AND userId = ?`,
      [title, status, id, req.user.userId]
    );

    res.status(200).json({
      message: "Todo updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update todo. Please try again.",
    });
  }
};

// Delete an existing Todo
exports.deleteTodo = async (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;

  try {
    // Check if the todo exists for the user
    const todo = await db.get(
      `SELECT * FROM todos WHERE id = ? AND userId = ?`,
      [id, req.user.userId]
    );

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found for this user.",
      });
    }

    // Delete the todo
    await db.run(`DELETE FROM todos WHERE id = ? AND userId = ?`, [
      id,
      req.user.userId,
    ]);

    res.status(200).json({
      message: "Todo deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete todo. Please try again.",
    });
  }
};
