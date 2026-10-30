import new_todo from "./assets/new_todo.svg";
import remove_todo from "./assets/remove_todo.svg";
import description from "./assets/description.svg";
import back_image from "./assets/back.svg";
import view_project from "./assets/view-project.svg";
import new_button from "./assets/new.svg";
import Quill from "quill";
import "quill/dist/quill.core.css";
import { compareAsc, format } from "date-fns";
import { createNewProject } from "./projects.js";

export function createNewDom() {
    const content = document.querySelector(".main-content");
    content.setAttribute("style", 'padding: 8px;');
    const projects_button = document.querySelector(".nav-button#projects");
    const projects_list = document.createElement("div");
    projects_button.addEventListener("click", () => {
        renderProjects();
    });

    let projectCount = 0;
    let todoCount = 0;
    let todo_container;
    let pjt_name;
    let options;

    function loadProject(project_start_date, project_due_date, project_name, description, priority) {
        content.replaceChildren();
        pjt_name = project_name;

        const todolist = document.createElement("div");
        todolist.setAttribute("class", "todolist")
        todolist.setAttribute("style", "min-height: 50vh; width: 75%; background-color: white; border-radius: 15px; display: grid; grid-template: repeat(100,1fr) / repeat(100,1fr);");

        const project_header = document.createElement("div");
        project_header.setAttribute("class", "project-header");
        project_header.setAttribute("style", "display: flex; justify-content: center; align-items: center; grid-area: 4/4/10/50; color: black; ")
        project_header.innerHTML += "<h1>" + project_name + "</h1>";
        todolist.appendChild(project_header);

        const dates = document.createElement("div");
        dates.setAttribute("class", "project_dates");
        dates.setAttribute("style", "display:flex; justify-content: right; grid-area: 5/50/10/90")
        dates.innerHTML += "<h2>" + project_start_date + " -- " + project_due_date + "</h2>";
        todolist.appendChild(dates);

        const sidebar_thing = document.createElement("div");
        sidebar_thing.setAttribute("class", "sidebar_thing");
        sidebar_thing.setAttribute("style", "grid-area: 1/1/101/3; background-color: rgba(150,150,255); border-top-left-radius: 15px; border-bottom-left-radius: 15px;")
        todolist.appendChild(sidebar_thing);

        const pri = document.createElement("div");
        pri.setAttribute("class", "priority");
        pri.setAttribute("style", "grid-area: 1/4/10/6; display: flex; justify-content: right; align-items: end; color: rgba(150,150,255);");
        pri.innerHTML += "<h1>" + priority + "</h1>";
        todolist.appendChild(pri)

        todo_container = document.createElement("div");
        todo_container.setAttribute("class", 'todo-container');
        todo_container.setAttribute('style', 'grid-area: 10/10/90/90; display: flex; flex-direction: column; gap: 10px; padding: 10px;');
        todolist.appendChild(todo_container);

        options = document.createElement("div");
        options.setAttribute("class", "options");
        options.setAttribute("style", 'grid-area: 91/4/100/95; display: flex; gap: 10px; justify-content: right; align-items: center;');
        todolist.appendChild(options);

        const newTodoButton = document.createElement("img");
        newTodoButton.src = new_todo;
        newTodoButton.setAttribute("class", "new-project-button");
        newTodoButton.setAttribute("style", 'height: 30px; width: 30px; object-fit: contain;');
        newTodoButton.addEventListener("mouseenter", () => {
            newTodoButton.style.cursor = "pointer";
        });
        newTodoButton.addEventListener("mouseleave", () => {
            newTodoButton.style.cursor = "default";
        });
        newTodoButton.addEventListener("click", () => {
            addTodolist();
        })
        options.appendChild(newTodoButton);

        content.appendChild(todolist);

        renderTodos();
    }

    function addTodolist() {
        todoCount++;
        let name, desc = '', due, done = false, pri = 1;

        const todo = document.createElement("div");
        todo.setAttribute("class", 'todo');
        todo.setAttribute("style", 'max-width: 100%; height: 50px; display: grid; grid-template-columns: repeat(20,1fr); grid-template-rows: 100fr; align-items: center; border: 1px solid black; border-radius: 5px;');

        const checkbox = document.createElement("input");
        checkbox.setAttribute("class", "checkbox");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("style", "width: 20px; height: 20px; grid-area: 1/2/1/4; display: flex; align-items: center;");
        todo.appendChild(checkbox);

        const todoname = document.createElement("input");
        todoname.setAttribute('class', 'todoname');
        todoname.setAttribute('type', 'text');
        todoname.setAttribute('placeholder', 'Enter name here...');
        todoname.setAttribute("style", "grid-area: 1/5/1/10; display: flex; align-items: center; font-family:'Average Sans', sans-serif; font-size: 1.2rem; display: flex; align-items: center; border: none;")
        todo.appendChild(todoname);

        const due_date = document.createElement('input');
        due_date.setAttribute("class", "todo_due_date");
        due_date.setAttribute('type', 'date');
        due_date.setAttribute("style", "grid-area: 1/14/1/20; display: flex; justify-content: right; align-items: center; font-size: 1.2rem; display: flex; justify-content: right; border: none;");

        todo.appendChild(due_date);

        todo.appendChild(checkbox);
        todo.appendChild(todoname);
        todo.appendChild(due_date);

        todo_container.appendChild(todo);

        done = checkbox.checked;

        todo.addEventListener("keydown", (e) => {
            if (e.key == 'Enter') {
                name = todoname.value;
                due = format(due_date.value, "dd-MM-yyyy");
                localStorage.setItem(`${pjt_name}-${name}`, JSON.stringify({ name, desc, due, done, pri }));
                todo_container.removeChild(todo);
                renderTodo(name, desc, due, done, pri);
            }
        });
    }

    function renderTodo(name, desc, due, done, pri) {
        const todo_image = document.createElement("div");
        todo_image.setAttribute("name", 'todo');
        todo_image.setAttribute("id", todoCount);
        todo_image.setAttribute('style', 'max-width: 100%; height: 50px; display: grid; grid-template-columns: repeat(20,1fr); grid-template-rows: 100fr; border: 1px solid black; border-radius: 5px; align-items: center;');

        const checkbox = document.createElement("input");
        checkbox.setAttribute("class", "checkbox");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("style", "width: 20px; height: 20px; grid-area: 1/2/1/4; display: flex; align-items: center;");
        if (done) checkbox.checked = true;
        todo_image.appendChild(checkbox);

        const todoname = document.createElement("div");
        todoname.setAttribute("style", "grid-area: 1/4/1/10; display: flex; align-items: center;")
        if (!done) {
            todoname.innerHTML += "<h2>" + name + "</h2>";
        } else {
            todoname.innerHTML += "<h2>" + "<i>" + name + "</i>" + "</h2>";
        }
        todo_image.appendChild(todoname);

        const todoOptions = document.createElement("div");
        todoOptions.setAttribute("style", 'grid-area: 1/10/1/14; display: flex; align-items: center; justify-content: center; gap: 10px;');
        todo_image.appendChild(todoOptions);

        const removeTodo = document.createElement("img");
        removeTodo.setAttribute('class', 'remove-todo-button');
        removeTodo.src = remove_todo;
        removeTodo.setAttribute('style', "width: 20px; height: 20px; object-fit: contain;");
        todoOptions.appendChild(removeTodo);

        const todoDesc = document.createElement("img");
        todoDesc.src = description;
        todoDesc.setAttribute('style', 'width: 20px; height: 20px; object-fit: contain;');
        todoOptions.appendChild(todoDesc);

        const due_date = document.createElement("div");
        due_date.setAttribute("class", "todo_due_date");
        due_date.setAttribute("style", "grid-area: 1/14/1/20; display: flex; justify-content: right; align-items: center;");
        due_date.innerHTML += "<h2>" + due + "</h2>";
        todo_image.appendChild(due_date);

        todo_container.appendChild(todo_image);

        checkbox.addEventListener("click", () => {
            done = !done;
            (done) ? todoname.innerHTML = "<h2>" + "<i>" + name + "</i>" + "</h2>" : todoname.innerHTML = "<h2>" + name + "</h2>";
            localStorage.removeItem(`${pjt_name}-${name}`);
            localStorage.setItem(`${pjt_name}-${name}`, JSON.stringify({ name, desc, due, done, pri }));
        });

        removeTodo.addEventListener("mouseenter", () => {
            removeTodo.style.cursor = "pointer";
        });
        removeTodo.addEventListener("mouseleave", () => {
            removeTodo.style.cursor = "default";
        });
        removeTodo.addEventListener('click', () => {
            localStorage.removeItem(`${pjt_name}-${name}`);
            todo_container.replaceChildren();
            renderTodos();
        });

        todoDesc.addEventListener("mouseenter", () => {
            todoDesc.style.cursor = "pointer";
        });
        todoDesc.addEventListener("mouseleave", () => {
            todoDesc.style.cursor = "default";
        });
        todoDesc.addEventListener('click', () => {
            const item = JSON.parse(localStorage.getItem(`${pjt_name}-${name}`));
            // console.log("item:");
            // console.log(item);
            loadTodo(item.name, item.desc, item.due, item.done, item.pri);
        });
    }

    function renderTodos() {
        let todos = getTodos();
        for (let todo of todos) {
            renderTodo(todo.name, todo.desc, todo.due, todo.done, todo.pri);
        }
    }

    function getTodos() {
        let todos = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${pjt_name}`)) {
                todos.push(JSON.parse(localStorage.getItem(key)));
            }
        }

        return todos;
    }

    function loadTodo(name, desc, due, done, pri) {
        content.replaceChildren();

        const todoDesc_container = document.createElement("div");
        todoDesc_container.setAttribute("class", "desc-container")
        todoDesc_container.setAttribute('style', 'height: 87vh; min-height: 100%; width: 75%; background-color: white; border-radius: 15px; display: grid; grid-template: repeat(100,1fr) / repeat(100,1fr);')
        content.appendChild(todoDesc_container);

        const back = document.createElement("div");
        back.setAttribute("class", "back-button")
        back.setAttribute("style", "grid-area: 94/3/98/7; display: flex; gap: 5px;");
        todoDesc_container.appendChild(back);

        const back_button = document.createElement("img");
        back_button.setAttribute("class", "back-button");
        back_button.setAttribute("style", "width: 70px; height: 20px; object-fit: cover;");
        back_button.src = back_image;
        back.appendChild(back_button);

        const back_text = document.createElement("div");
        back_text.setAttribute("class", "back-text");
        back_text.setAttribute("style", "font-size: 1rem;");
        back_text.innerHTML = `<p>Back</p>`;
        back.appendChild(back_text);

        const desc_namecard = document.createElement("div");
        desc_namecard.setAttribute("class", 'desc-namecard');
        desc_namecard.setAttribute("style", 'grid-area: 10/10/20/40;');
        desc_namecard.innerHTML += `<h1 style="font-size: 2rem;"> ${pjt_name} : ${name} </h1>`;
        todoDesc_container.appendChild(desc_namecard);

        const desc_due = document.createElement("div");
        desc_due.setAttribute("class", 'desc-due')
        desc_due.setAttribute('style', 'grid-area: 12/75/16/100; display: flex; align-items: center; justify-content: center;');
        desc_due.innerHTML += `<h2> Due : ${due} </h2>`;
        todoDesc_container.appendChild(desc_due);

        const desc_content = document.createElement("div");
        desc_content.setAttribute("class", 'desc-content');
        desc_content.setAttribute("style", "grid-area: 20/10/90/95; border-radius: 10px; border: 1px solid black;");
        desc_content.innerHTML = `<p> ${desc} </p>`;
        todoDesc_container.appendChild(desc_content);

        const content_editor = new Quill(`.desc-content`);
        desc_content.style.fontFamily = `"Average Sans", sans serif`;
        desc_content.style.fontSize = "1.5rem";
        content_editor.setText(desc);

        content_editor.on("text-change", () => {
            desc = content_editor.getText().trimEnd();
            localStorage.setItem(`${pjt_name}-${name}`, JSON.stringify({ name, desc, due, done, pri }));
        });


        back.addEventListener("mouseenter", () => {
            back.style.cursor = "pointer";
        });
        back.addEventListener("mouseleave", () => {
            back.style.cursor = "default";
        });
        back.addEventListener("click", () => {
            content.replaceChildren();
            const current_project = JSON.parse(localStorage.getItem(`project-${pjt_name}`));
            loadProject(current_project.curr_date, current_project.due_date, current_project.project_name, current_project.description, current_project.priority);
        });

    }

    function getProjects() {
        let projects = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`project-`)) {
                projects.push(JSON.parse(localStorage.getItem(key)));
            }
        }

        return projects;
    }

    function addProject() {
        let project_start_date;
        let project_due_date;
        let project_name;
        let description = "";
        let priority = 1;

        const project = document.createElement("div");
        project.setAttribute("class", `project-form`);
        project.setAttribute("style", 'min-height: 50px; width: 95%; border: 1px solid black; display: grid; grid-template: repeat(50,1fr) / repeat(100,1fr); border-radius: 10px;');
        projects_list.appendChild(project);

        const sideaccent = document.createElement('div');
        sideaccent.setAttribute("class", "sideaccent");
        sideaccent.setAttribute('style', 'grid-area: 1/1/51/2; border-top-left-radius: 10px; border-bottom-left-radius: 10px; background-color: skyblue;');
        project.appendChild(sideaccent);

        const project_namecard = document.createElement("input");
        project_namecard.setAttribute("class", "project_namecard_input");
        project_namecard.setAttribute("style", 'grid-area: 5/5/45/50; display: flex; justify-content: left; align-items: center; border-radius: 5px; border: none;');
        project_namecard.type = "text";
        project_namecard.placeholder = "Enter Project Name here...";
        project.appendChild(project_namecard);

        const pri = document.createElement("input");
        pri.setAttribute("class", 'priority-input');
        pri.setAttribute("style", "grid-area: 5/51/45/70; border-radius: 5px; border: 1px solid black; border: none;");
        pri.type = "number";
        pri.placeholder = "Enter Priority here";
        project.appendChild(pri);

        const due = document.createElement("input");
        due.setAttribute("class", 'due-date-input');
        due.setAttribute("style", "grid-area: 5/82/45/95; display: flex; justify-content: right; align-items: center; border-radius: 5px; border: none;");
        due.type = "date";
        due.placeholder = "dd/MM/yyyy";
        project.appendChild(due);

        project.addEventListener("keydown", (e) => {
            if (e.key == 'Enter') {
                if(project_start_date === "") project_start_date = "?";
                project_name = project_namecard.value;
                project_due_date = format(due.value, "dd-MM-yyyy");
                priority = pri.value;
                if(project_start_date === undefined) project_start_date = "-"; 
                const new_project = createNewProject(project_start_date, project_due_date, project_name, description, priority);
                console.log("in addProject:");
                console.log(new_project);
                localStorage.setItem(`project-${project_name}`, JSON.stringify(new_project));
                projects_list.removeChild(project);
                renderProjects();
            }
        });
    }
    
    function renderProjects() {
        content.replaceChildren();

        const projects_container = document.createElement("div");
        projects_container.setAttribute("class", "projects-container");
        projects_container.setAttribute('style', 'height: 86vh; min-height: 100%; width: 75%; background-color: white; border-radius: 10px; display: grid; grid-template: repeat(100,1fr) / repeat(100,1fr);');
        content.appendChild(projects_container);

        const heading = document.createElement('div');
        heading.setAttribute("class", 'projects-heading');
        heading.setAttribute('style', 'grid-area: 4/5/8/25;');
        heading.innerHTML += "<h1 style='font-size: 2rem;'>Your Projects</h1>";
        projects_container.appendChild(heading);

        projects_list.setAttribute("class", 'projects-list');
        projects_list.setAttribute("style", 'grid-area: 15/5/95/100; display: flex; flex-direction: column; gap: 10px;');
        projects_container.appendChild(projects_list);

        const projects = getProjects();
        projects_list.replaceChildren();
        for (let project of projects) {
            //console.log(project);
            renderProject(project.curr_date, project.due_date, project.project_name, project.description, project.priority);
        }

        const add_project_button = document.createElement("img");
        add_project_button.setAttribute("class", 'add-project-button');
        add_project_button.setAttribute("style", 'height: 50px; width: 50px; grid-area: 95/95/100/100; object-fit: contain;');
        add_project_button.src = new_button;
        projects_container.appendChild(add_project_button);

        add_project_button.addEventListener("mouseenter", () => {
            add_project_button.style.cursor = "pointer";
        });
        add_project_button.addEventListener("mouseleave", () => {
            add_project_button.style.cursor = "default";
        });
        add_project_button.addEventListener("click", () => {
            addProject();
        });
    }


    function renderProject(project_start_date, project_due_date, project_name, description, priority = 1) {
        const project = document.createElement("div");
        project.setAttribute("class", `${project_name}`);
        project.setAttribute("style", 'min-height: 50px; width: 95%; border: 1px solid black; display: grid; grid-template: repeat(50,1fr) / repeat(100,1fr); border-radius: 10px;');
        projects_list.appendChild(project);

        const sideaccent = document.createElement('div');
        sideaccent.setAttribute("class", "sideaccent");
        sideaccent.setAttribute('style', 'grid-area: 1/1/51/2; border-top-left-radius: 10px; border-bottom-left-radius: 10px; background-color: skyblue;');
        project.appendChild(sideaccent);

        const project_namecard = document.createElement("div");
        project_namecard.setAttribute("class", "project_namecard");
        project_namecard.setAttribute("style", 'grid-area: 1/5/50/50; display: flex; justify-content: left; align-items: center;');
        project_namecard.innerHTML += `<h2 style="font-size: 1.3rem;">${project_name}</h2>`;
        project.appendChild(project_namecard);

        const pri = document.createElement("div");
        pri.setAttribute("class", 'priority');
        if (priority === "1") {
            pri.setAttribute("style", "grid-area: 16/51/35/53; background-color: green; border-radius: 15px; border: 2px solid black;");
        } else if (priority === '2') {
            pri.setAttribute("style", "grid-area: 16/51/35/53; background-color: yellow; border-radius: 15px; border: 2px solid black;");
        } else {
            pri.setAttribute("style", "grid-area: 16/51/35/53; background-color: red; border-radius: 15px; border: 2px solid black;");
        }
        project.appendChild(pri);

        const open_project = document.createElement("img");
        open_project.setAttribute("class", 'open_project_button');
        open_project.setAttribute("style", "width: 20px; height: 20px; grid-area: 15/55/50/82; object-fit: contain;");
        open_project.src = view_project;
        project.appendChild(open_project);

        const due = document.createElement("div");
        due.setAttribute("class", 'due-date');
        due.setAttribute("style", "grid-area: 1/82/50/95; display: flex; justify-content: right; align-items: center;");
        due.innerHTML += `<p style="font-size: 1.2rem;">${project_due_date}</p>`;
        project.appendChild(due);

        open_project.addEventListener("mouseenter", () => {
            open_project.style.cursor = "pointer";
        });
        open_project.addEventListener("mouseleave", () => {
            open_project.style.cursor = "default";
        });
        open_project.addEventListener("click", () => {
            // console.log("after open project:");
            // console.log({project_start_date, project_due_date, project_name, description, priority});
            loadProject(project_start_date, project_due_date, project_name, description, priority);
            console.log({project_start_date, project_due_date, project_name, description, priority});
        });
    }

    return {
        loadProject,
        loadTodo,
        addTodolist,
    };
}

export const DOM = createNewDom();