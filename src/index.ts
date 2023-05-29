import "dotenv/config";
import "module-alias/register";

import App from "./app";
import UserController from "./models/users/controller";
import JobController from "./models/jobs/controller";
import {validateEnv} from "./utils/validate";

validateEnv();

const app = new App(
  [new UserController(), new JobController()],
  Number(process.env.PORT)
);

app.listen();