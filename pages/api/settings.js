import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Setting } from "@/models/Settings";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  const { method } = req;

  if (method === "PUT") {
    const { name, value } = req.body;
    const settingsDoc = await Setting.findOne({ name });
    if (settingsDoc) {
      settingsDoc.value = value;
      await settingsDoc.save();
      res.json(settingsDoc);
    } else {
      res.json(await Setting.create({ name, value }));
    }
  }

  if (method === "GET") {
    const { name } = req.query;
    res.json(await Setting.findOne({ name }));
  }
}
