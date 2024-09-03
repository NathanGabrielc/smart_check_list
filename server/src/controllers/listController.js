const pool = require("../db");

// Obtém todas as listas
exports.getLists = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lists");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cria uma nova lista
exports.createList = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO lists (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza uma lista existente
exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE lists SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Exclui uma lista
exports.deleteList = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM lists WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
