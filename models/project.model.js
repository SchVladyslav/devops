const { Schema, model } = require("mongoose");

const projectSchema = new Schema({
  client_secret: {
    type: String,
    required: true,
    unique: true,
  },
  client_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURLs: [
    {
      type: String,
      required: true,
    },
  ],
  scope: {
    type: String,
    enum: ["default", "email", "phone", "full"],
    default: "default",
  },
  createdBy: {
    type: Schema.ObjectId,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Project", projectSchema);
