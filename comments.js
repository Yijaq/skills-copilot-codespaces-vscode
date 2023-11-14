// Create web server

// npm install express
// npm install body-parser
// npm install mongoose
// npm install cors

// Import modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Create the server
const app = express();

// Use the modules
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
mongoose.connect("mongodb://localhost:27017/comments", { useNewUrlParser: true });

// Create a schema for comments
const commentSchema = mongoose.Schema({
    name: String,
    comment: String
});

// Create a model for comments
const Comment = mongoose.model("Comment", commentSchema);

// Get all comments
app.get("/api/comments", async (request, response) => {
    const comments = await Comment.find();
    response.send(comments);
});

// Get one comment by id
app.get("/api/comments/:id", async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        if (!comment) {
            response.status(404).send({
                message: "Comment not found"
            });
        } else {
            response.send(comment);
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

// Add a new comment
app.post("/api/comments", async (request, response) => {
    const comment = new Comment({
        name: request.body.name,
        comment: request.body.comment
    });
    try {
        const newComment = await comment.save();
        response.send(newComment);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Update a comment
app.put("/api/comments/:id", async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        if (!comment) {
            response.status(404).send({
                message: "Comment not found"
            });
        } else {
            comment.name = request.body.name;
            comment.comment = request.body.comment;
            const updatedComment = await comment.save();
            response.send(updatedComment);
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

