import { Router } from "express";
import Controller from "../controllers/controller.ts";

export default class RouterHandler {
  public handler;

  private controller: Controller;

  constructor(ctr: Controller) {
    this.handler = Router();

    this.controller = ctr;
    this.bind_routes();
  }

  private bind_routes() {
    this.handler.post("/bucket", this.controller.create_bucket);
    this.handler.post("/file/upload", this.controller.upload);
    this.handler.get("/files/:bucket_id", this.controller.list_dir);

    this.handler.get("/file/:bucket_id", this.controller.download_file);
    this.handler.head("/file/:bucket_id", this.controller.file_data);
  }
}
