import { set } from "lodash";
import new_todo from "./assets/new_todo.svg";

export function createNewDom() {
    const content = document.querySelector(".main-content");
    let projectCount = 0;
    let todoCount = 0;
    let todo_container;
    let todos=[];
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
        todo_container.setAttribute("class",'todos');
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
    }   

    function addTodolist() {
        todoCount++;
        let name,desc='',due,done=false,pri=1;
        todos.push({name,desc,due,done,pri,todoCount});

        const todo = document.createElement("div");
        todo.setAttribute("class",'todo');
        todo.setAttribute("style",'max-width: 100%; height: 50px; display: flex; gap: 10px; align-items: center; border: 1px solid black; border-radius: 5px;');
        
        const checkbox = document.createElement("input");
        checkbox.setAttribute("class","checkbox");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("style","width: 20px; height: 20px;");
        todo.appendChild(checkbox); 

        const todoname = document.createElement("input");
        todoname.setAttribute('class','todoname');
        todoname.setAttribute('placeholder','Enter name here...');
        todoname.setAttribute("style","display: flex; align-items: center; height: 80%; width: 70%; border: none;")
        todo.appendChild(todoname);

        const due_date = document.createElement('input');
        due_date.setAttribute('placeholder','dd/MM/yyyy');
        due_date.setAttribute("class","todo_due_date");
        due_date.setAttribute("style","height: 80%; display: flex; justify-content: right; border: none;");
        todo.appendChild(due_date);

        todo.appendChild(checkbox);
        todo.appendChild(todoname);
        todo.appendChild(due_date);

        todo_container.appendChild(todo);

        todo.addEventListener("keydown", (e) => {
            if(e.key == 'Enter') {
                name = todoname.value;
                due = due_date.value;
                localStorage.setItem(`${pjt_name}-${name}`,JSON.stringify({name, desc, due, done, pri}));
                todo_container.removeChild(todo);
                renderTodo(name, desc, due, done, pri);
            }
        })
    }

    function renderTodo(name, desc, due, done, pri) {

        //render after reading data.
        const todo = document.createElement("div");
        todo.setAttribute("name",'todo');
        todo.setAttribute("id",todoCount);
        todo.setAttribute('style','max-width: 100%; height: 50px; display: flex; gap: 10px; align-items: center; border: 1px solid black; border-radius: 5px;');
        
        const checkbox = document.createElement("input");
        checkbox.setAttribute("class","checkbox");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("style","width: 20px; height: 20px;");
        todo.appendChild(checkbox);
        
        const todoname = document.createElement("div");
        todoname.setAttribute("style","width:70%; height: 80%; display: flex; align-items: center;")
        todoname.innerHTML += "<h2>" + name + "</h2>";
        todo.appendChild(todoname);

        const due_date = document.createElement("div");
        due_date.setAttribute("class","todo_due_date");
        due_date.setAttribute("style","height: 80%; display: flex; justify-content: right; align-items: center;");
        due_date.innerHTML += "<h2>" + due + "</h2>";
        todo.appendChild(due_date);
        
        todo_container.appendChild(todo);

    }

    function loadTodo() {

    }

    return { 
        loadProject,
        loadTodo,
        addTodolist,
    };
}

export const DOM = createNewDom();