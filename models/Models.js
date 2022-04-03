import mongoose from "mongoose";

const Schema = mongoose.Schema;
const linkSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String },
  tags: { type: Array, required: true },
  url: { type: String, required: true },
});

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: { type: Array, required: true },
  links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
});

/* before a deleteone request for a link document is sent, delete its own reference inside the Topic document,
if no reference was found cancel the operation and send an error*/
linkSchema.pre("deleteOne", async function (doc, next) {
  const {
    _conditions: { _id },
  } = this;

  const result = await Topic.findOneAndUpdate(
    { links: { $eq: _id } },
    { $pull: { links: _id } }
  );
  if (!result)
    return next(
      new Error(
        `404 Not Found: No reference to a document with id ${_id} was found in the selected topic. Operation canceled. `
      )
    );
  next();
});
const Topic =
  mongoose.models?.Topic || mongoose.model("Topic", topicSchema, "topics");
const Link = mongoose.models?.Link || mongoose.model("Link", linkSchema);

export { Topic, Link };
