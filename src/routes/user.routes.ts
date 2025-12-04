import { Router, Request, Response } from "express";
import pool from "../db/db";

const router = Router();

// ➤ GET all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ➤ GET single user
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// ➤ CREATE new user
router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error creating user" });
  }
});

// ➤ DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export const userRoutes = router;
