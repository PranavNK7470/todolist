import { DOM } from "./DOM.js";
import { createNewTodo } from "./todolist.js";

export function createNewProject(curr_date, due_date, project_name, description = "", priority = 1) {
    let todocount = 0;
    let todolist = [];

    DOM.loadProject(curr_date, due_date, project_name, description, priority);

    function addTodolist() {
        const todo = createNewTodo();
        localStorage.setItem(`project-${project_name}`, JSON.stringify({curr_date, due_date, project_name, description, priority}));
        return todo;
    }

    return {
        todolist,
        curr_date,
        due_date,
        project_name,
        description,
        priority,
        addTodolist,
    };
}