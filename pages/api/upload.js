import multiparty from "multiparty";
import { v2 as cloudinary } from "cloudinary";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Product } from "@/models/Product";
import { redirect } from "next/dist/server/api-utils";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "POST") {
    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const links = [];
    for (const file of files.file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      const images = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      links.push(images);
    }
    return res.json({ links });
  }

  if (method === "DELETE") {
    if (req.query?.id && req.query?.public_id) {
      await cloudinary.uploader.destroy(req.query.public_id);

      const product = await Product.findOne({ _id: req.query.id });

      product.images = product.images.filter(
        (image) => image.public_id !== req.query.public_id
      );

      await product.save();

      res.json(true);
    }
  }
}

export const config = {
  api: { bodyParser: false },
};
