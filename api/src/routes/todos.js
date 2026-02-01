const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

router.post("/", async (req, res) => {
  const { title, completed } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const todo = await Todo.create({ title: title.trim(), completed: !!completed });
  res.status(201).json(todo);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const updates = {};
  if (req.body?.title !== undefined) {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    updates.title = req.body.title.trim();
  }
  if (req.body?.completed !== undefined) updates.completed = !!req.body.completed;

  const todo = await Todo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

module.exports = router;
