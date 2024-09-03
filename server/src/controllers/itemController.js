const pool = require("../db");

// Obtém todos os itens de uma lista
exports.getItems = async (req, res) => {
  const { listId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE list_id = $1", [
      listId,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cria um novo item
exports.createItem = async (req, res) => {
  const { name, listId, status = false } = req.body; // Adicione um valor padrão para status

  // Verificar se o status é um booleano
  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name, list_id, status) VALUES ($1, $2, $3) RETURNING *",
      [name, listId, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza um item existente
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body; // Inclua status

  // Verificar se o status é um booleano, se fornecido
  if (status !== undefined && typeof status !== "boolean") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const result = await pool.query(
      "UPDATE items SET name = COALESCE($1, name), status = COALESCE($2, status) WHERE id = $3 RETURNING *",
      [name, status, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Exclui um item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
