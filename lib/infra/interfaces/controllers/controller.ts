import { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class Controller {
  private BUCKET_PATH: string;

  constructor() {
    if (null === process.env.BUCKET_PATH)
      throw Error(`BUCKET_PATH is required!`);
    this.BUCKET_PATH = process.env.BUCKET_PATH!;

    this.upload = this.upload.bind(this);
    this.list_dir = this.list_dir.bind(this);
    this.download_file = this.download_file.bind(this);
    this.file_data = this.file_data.bind(this);
    this.create_bucket = this.create_bucket.bind(this);
  }

  async create_bucket(r: Request, rs: Response) {
    try {
      const bucket_id = crypto.randomUUID();
      const bucket_path = path.join(this.BUCKET_PATH, bucket_id);

      if (!fs.existsSync(bucket_path)) {
        fs.mkdirSync(bucket_path, { recursive: true });
      }

      return rs.status(201).json({
        message: "Bucket created successfully",
        bucket_id,
      });
    } catch (err) {
      console.error(err);
      return rs.status(500).json({ message: String(err) });
    }
  }

  async upload(r: Request, rs: Response) {
    try {
      if (!r.files || Object.keys(r.files).length === 0) {
        return rs.status(400).json({ message: "No file uploaded" });
      }

      const bucket_id = r.body.bucket_id as string;
      if (!bucket_id) {
        return rs.status(400).json({ message: "bucket_id is required" });
      }

      const folder = r.body.folder as string | undefined;
      const rename = r.body.rename as string | undefined;

      const bucket_path = path.join(this.BUCKET_PATH, bucket_id);
      if (!fs.existsSync(bucket_path)) {
        return rs.status(404).json({ message: "Bucket not found" });
      }

      const target_path = folder ? path.join(bucket_path, folder) : bucket_path;
      fs.mkdirSync(target_path, { recursive: true });

      const file = r.files.file as any;

      // usa rename se existir, senao mantem nome original
      const filename = rename || file.name;

      const dest_path = path.join(target_path, filename);

      await file.mv(dest_path);

      return rs.status(201).json({
        message: "File uploaded successfully",
        bucket: bucket_id,
        folder: folder || null,
        original: file.name,
        stored_as: filename,
      });
    } catch (err) {
      console.error(err);
      return rs.status(500).json({ message: String(err) });
    }
  }

  async list_dir(r: Request, rs: Response) {
    try {
      const bucket_id = r.params.bucket_id as string;
      const folder = r.query.folder as string | undefined; // ?folder=empresa/user

      const dir = folder
        ? path.join(this.BUCKET_PATH, bucket_id, folder)
        : path.join(this.BUCKET_PATH, bucket_id);

      if (!fs.existsSync(dir)) {
        return rs.status(404).json({ message: "Folder not found" });
      }

      const items = fs.readdirSync(dir, { withFileTypes: true });

      const files = items.filter((i) => i.isFile()).map((i) => i.name);
      const folders = items.filter((i) => i.isDirectory()).map((i) => i.name);

      return rs.json({
        bucket: bucket_id,
        folder: folder || "/",
        folders,
        files,
      });
    } catch (err) {
      return rs.status(500).json({ message: String(err) });
    }
  }

  async download_file(r: Request, rs: Response) {
    try {
      const bucket_id = r.params.bucket_id;
      const relative_path = (r.query.path as string) || ""; // ?path=empresa/user/avatar.png

      const file_path = path.join(this.BUCKET_PATH, bucket_id!, relative_path);

      if (!fs.existsSync(file_path)) {
        return rs.status(404).json({ message: "File not found" });
      }

      return rs.download(file_path);
    } catch (err) {
      return rs.status(500).json({ message: String(err) });
    }
  }

  async file_data(r: Request, rs: Response) {
    try {
      const bucket_id = r.params.bucket_id;
      const relative_path = (r.query.path as string) || "";

      const file_path = path.join(this.BUCKET_PATH, bucket_id!, relative_path);

      if (!fs.existsSync(file_path)) {
        return rs.status(404).end();
      }

      const stats = fs.statSync(file_path);
      rs.setHeader("Content-Length", stats.size);
      rs.setHeader("Last-Modified", stats.mtime.toUTCString());
      return rs.status(200).end();
    } catch (err) {
      return rs.status(500).json({ message: String(err) });
    }
  }
}
