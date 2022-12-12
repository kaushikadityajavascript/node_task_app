const express = require("express");
var db = require("../models");
var Task = db.task;
var User = db.user;
//const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const { userHasRole } = require("../middleware/helper");

const router = express.Router();

// route to create tasks
router.post("/addTask", fetchUser, async (req, res) => {
  try {
    const task = await Task.create({
      reminder_date: req.body.reminder_date,
      description: req.body.description,
      title: req.body.title,
      user_id: req.user.id,
    });
    console.log(task);
    // const savedTask = await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: "Internal server problem" });
  }
});

// Route to delete a task
router.delete("/deleteTask/:id", fetchUser, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(400).send("Task not exists");
    }
    if (task.user_id !== req.user.id) {
      return res.status(400).send("You are not authorized");
    }
    await Task.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send("Task deleted successfully");
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
});

// Route to fetch tasks by id
// router.get("/fetchTaskById/:id", fetchUser, async (req, res) => {
//   let success = false;

//   try {
//     const isAdmin = await userHasRole(req.user.id, 1);
//     //console.log(isAdmin);
//     const data = await Task.findOne({
//       where: { id: req.params.id },
//       // include: [
//       //   {
//       //     model: User,
//       //   },
//       // ],
//     });
//     console.log("user-data", data);
//     if (!data) {
//       return res.send({ data: "Task not exists" });
//     }
//     res.status(200).json({ data: data });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ success, err: "Some Error has occurred", msg: err.message });
//   }
// });

// Route to fetch tasks of logged in user only
router.get("/fetchTaskByUser/:id", fetchUser, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(400).send("Task not exists");
    }
    if (task.user_id !== req.user.id) {
      return res.status(400).send("You are not authorized");
    }
    res.status(200).json({ data: task });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
});

module.exports = router;
