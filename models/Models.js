import mongoose from "mongoose";

import DBClient from "../utils/DBClient.js";

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: { type: Array, required: true },
  links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
});

const linkSchema = new Schema({
  title: { type: String, required: true },
  tags: { type: Array, required: true },
  link: { type: String, required: true },
});

const Topic =
  mongoose.models.Topic || mongoose.model("Topic", topicSchema, "topics");
const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

export { Topic, Link };
