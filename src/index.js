import "./style.css";
/*due_date, project_name, description, priority*/
import { createNewProject } from "./projects.js";
import { compareAsc, format } from "date-fns";

let default_project = createNewProject(format(Date.now(), "dd-MM-yyyy"),format(new Date(2026,11,17), "dd-MM-yyyy"), "default", "", 1);

// name, desc, due, done, pri
//default_project.addTodolist();