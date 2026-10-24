import new_todo from "./assets/new_todo.svg";
import remove_todo from "./assets/remove_todo.svg";
import description from "./assets/description.svg";
import { compareAsc, format } from "date-fns";

export function createNewDom() {
    const content = document.querySelector(".main-content");
    let projectCount = 0;
    let todoCount = 0;
    let todo_container;
    let pjt_name;
    let options;

    function loadProject(project_start_date, project_due_date, project_name, description, priority) {
        content.replaceChildren();
        pjt_name = project_name;

        const todolist = document.createElement("div");
        todolist.setAttribute("class","todolist")
        todolist.setAttribute("style","min-height: 50vh; width: 75%; background-color: white; border-radius: 15px; display: grid; grid-template: repeat(100,1fr) / repeat(100,1fr);");
        
        const project_header = document.createElement("div");
        project_header.setAttribute("class","project-header");
        project_header.setAttribute("style","display: flex; justify-content: center; align-items: center; grid-area: 4/4/10/50; color: black; ")
        project_header.innerHTML += "<h1>"+project_name+"</h1>";
        todolist.appendChild(project_header);

        const dates = document.createElement("div");
        dates.setAttribute("class","project_dates");
        dates.setAttribute("style","display:flex; justify-content: right; grid-area: 5/50/10/90")
        dates.innerHTML += "<h2>" + project_start_date + " -- " + project_due_date + "</h2>";
        todolist.appendChild(dates);
        
        const sidebar_thing = document.createElement("div");
        sidebar_thing.setAttribute("class", "sidebar_thing");
        sidebar_thing.setAttribute("style","grid-area: 1/1/101/3; background-color: rgba(150,150,255); border-top-left-radius: 15px; border-bottom-left-radius: 15px;")
        todolist.appendChild(sidebar_thing);

        const pri = document.createElement("div");
        pri.setAttribute("class","priority");
        pri.setAttribute("style","grid-area: 1/4/10/6; display: flex; justify-content: right; align-items: end; color: rgba(150,150,255);");
        pri.innerHTML += "<h1>" + priority + "</h1>";
        todolist.appendChild(pri)

        todo_container = document.createElement("div");
        todo_container.setAttribute("class",'todo-container');
        todo_container.setAttribute('style','grid-area: 10/10/90/90; display: flex; flex-direction: column; gap: 10px; padding: 10px;');
        todolist.appendChild(todo_container);

        options = document.createElement("div");
        options.setAttribute("class","options");
        options.setAttribute("style",'grid-area: 91/4/100/95; display: flex; gap: 10px; justify-content: right; align-items: center;');
        todolist.appendChild(options);

        const newTodoButton = document.createElement("img");
        newTodoButton.src = new_todo;
        newTodoButton.setAttribute("class","new-project-button");
        newTodoButton.setAttribute("style",'height: 30px; width: 30px; object-fit: contain;');
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
        let name,desc='',due,done=false,pri=1;

        const todo = document.createElement("div");
        todo.setAttribute("class",'todo');
        todo.setAttribute("style",'max-width: 100%; height: 50px; display: grid; grid-template-columns: repeat(20,1fr); grid-template-rows: 100fr; align-items: center; border: 1px solid black; border-radius: 5px;');
        
        const checkbox = document.createElement("input");
        checkbox.setAttribute("class","checkbox");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("style","width: 20px; height: 20px; grid-area: 1/2/1/4; display: flex; align-items: center;");
        todo.appendChild(checkbox); 

        const todoname = document.createElement("input");
        todoname.setAttribute('class','todoname');
        todoname.setAttribute('type','text');
        todoname.setAttribute('placeholder','Enter name here...');
        todoname.setAttribute("style","grid-area: 1/5/1/10; display: flex; align-items: center; font-family:'Average Sans', sans-serif; font-size: 1.2rem; display: flex; align-items: center; border: none;")
        todo.appendChild(todoname);

        const due_date = document.createElement('input');
        due_date.setAttribute("class","todo_due_date");
        due_date.setAttribute('type','date');
        due_date.setAttribute("style","grid-area: 1/14/1/20; display: flex; justify-content: right; align-items: center; font-size: 1.2rem; display: flex; justify-content: right; border: none;");
        todo.appendChild(due_date);

        todo.appendChild(checkbox);
        todo.appendChild(todoname);
        todo.appendChild(due_date);

        todo_container.appendChild(todo);

        checkbox.addEventListener("click", () => {
            done = true;
        });

        todo.addEventListener("keydown", (e) => {
            if(e.key == 'Enter') {
                name = todoname.value;
                due = format(due_date.value, "dd-MM-yyyy");
                localStorage.setItem(`${pjt_name}-${name}`,JSON.stringify({name, desc, due, done, pri}));
                todo_container.removeChild(todo);
                renderTodo(name, desc, due, done, pri);
            }
        })
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
        if(done) checkbox.checked = true;
        todo_image.appendChild(checkbox);

        const todoname = document.createElement("div");
        todoname.setAttribute("style", "grid-area: 1/4/1/10; display: flex; align-items: center;")
        if(!done) {
            todoname.innerHTML += "<h2>" + name + "</h2>";
        } else {
            todoname.innerHTML += "<h2>" + "<i>" + name + "</i>" + "</h2>";
        }
        todo_image.appendChild(todoname);

        const todoOptions = document.createElement("div");
        todoOptions.setAttribute("style",'grid-area: 1/10/1/14; display: flex; align-items: center; justify-content: center; gap: 10px;');
        todo_image.appendChild(todoOptions);

        const removeTodo = document.createElement("img");
        removeTodo.setAttribute('class','remove-todo-button');
        removeTodo.src = remove_todo;
        removeTodo.setAttribute('style',"width: 20px; height: 20px; object-fit: contain;");
        todoOptions.appendChild(removeTodo);

        const todoDesc = document.createElement("img");
        todoDesc.src = description;
        todoDesc.setAttribute('style','width: 20px; height: 20px; object-fit: contain;');
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
            localStorage.setItem(`${pjt_name}-${name}`, JSON.stringify({name, desc, due, done, pri}));
            renderTodos();
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
            loadTodo(name, desc, due, done, pri);
        });
    }

    function renderTodos() {
        let todos = getTodos();
        for(let todo of todos) {
            renderTodo(todo.name, todo.desc, todo.due, todo.done, todo.pri);
        }
    }

    function getTodos() {
        let todos = [];
        for(let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if(key.startsWith(`${pjt_name}`)) {
                todos.push(JSON.parse(localStorage.getItem(key)));
            }
        }

        return todos;
    }

    function loadTodo(name, desc, due, done, pri) {
        content.replaceChildren();

        const todoDesc_container = document.createElement("div");
        todoDesc_container.setAttribute('style','min-height: 50vh; width: 75%; background-color: white; border-radius: 15px; display: grid; grid-template: repeat(100,1fr) / repeat(100,1fr);')
        container.appendChild(todoDesc_container);
    
    }

    return { 
        loadProject,
        loadTodo,
        addTodolist,
    };
}

export const DOM = createNewDom();