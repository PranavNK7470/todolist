import { DOM } from "./DOM.js";

export function createNewTodo() {
    DOM.addTodolist();
    let name, desc, due, done, pri;
    return { name, desc, due, done, pri };
}