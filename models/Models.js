import mongoose from "mongoose";

const Schema = mongoose.Schema;
const linkSchema = new Schema({
  title: { type: String, required: true },
  tags: { type: Array, required: true },
  link: { type: String, required: true },
});

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: { type: Array, required: true },
  links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
});

const Topic =
  mongoose.models.Topic || mongoose.model("Topic", topicSchema, "topics");
const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

export { Topic, Link };
