import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  const { method } = req;

  if (method === "POST") {
    const { email } = req.body;
    if (await Admin.findOne({ email })) {
      res.status(400).json({ message: "Admin already exists " });
    }
    res.json(await Admin.create({ email }));
  }
  if (method === "GET") {
    res.json(await Admin.find());
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    res.json(await Admin.findByIdAndDelete({ _id }));
  }
}
