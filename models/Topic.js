import mongoose from "mongoose";

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: { type: Array, required: true },
  links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
  _creator: [{ type: Schema.Types.ObjectId, ref: "Admin" }],
});

const Topic =
  mongoose.models?.Topic || mongoose.model("Topic", topicSchema, "topics");

export default Topic;
