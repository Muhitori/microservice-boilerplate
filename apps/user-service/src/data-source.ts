import { DataSource } from "typeorm";
import { typeormConfig } from "./config/database.config";

export default new DataSource(typeormConfig);
