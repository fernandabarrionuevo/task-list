//Mando a llamar el botón de agregar
const btnAddTask = document.querySelector("[data-form-btn]");
btnAddTask.addEventListener("click", addTask);

//Mando a llamar los inputs y el contenedor de la lista de tareas
const inputTask = document.querySelector("[data-form-input]");
const inputDate = document.querySelector("[data-form-date]");
const ul = document.querySelector(".task-list-container");

//Mando a crear una lista de tareas asignando las tareas disponibles en el local storage y en el caso en que este vacio, entonces se crea un array de tareas
const taskList = JSON.parse(localStorage.getItem("task")) || [];

//Función que capta lo que el usuario escribe, lo manda al localStorage y pide mostrar las tareas
function addTask(event) {
  event.preventDefault();
  let taskName = inputTask.value;
  let taskDate = inputDate.value;

  //Con la función moment se formatea la fecha
  let dateFormate = moment(taskDate).format("DD/MM/YYYY");

  //Si alguno de los inputs estan vacios entonces que no cree ninguna tarea
  if (taskName === "" || taskDate === "") {
    return;
  }

  const id = uuid.v4();
  const complete = false;

  //La información enviada por el usuario se guarda en un objeto de tarea
  const taskObj = {
    taskName,
    dateFormate,
    id,
    complete,
  };

  //Se actualiza la lista de tareas
  taskList.push(taskObj);

  //Se resetea la información del localStorage
  localStorage.setItem("task", JSON.stringify(taskList));

  //Se vacian los inputs
  inputTask.value = "";
  inputDate.value = "";

  //Mando a mostrar la lista de tareas actualizada
  showTaskList();
}

function createTask(taskName, dateFormate, id, complete) {
  //Creando li
  const li = document.createElement("li");
  li.classList.add("task");

  //Creando icono de check
  let iCheck = document.createElement("i");

  //Las clases serán aplicadas dependiendo de si la tarea figura como completa o no
  if(!complete){
      iCheck.classList.add("fa-regular", "fa-circle-check", "check");
  }else{
    iCheck.classList.add("fa-solid", "fa-circle-check", "check");
  }
  //El ícono tendrá un identificador que servirá para cambiar su estado
  iCheck.setAttribute("check-id", id);
  iCheck.addEventListener("click", checkUncheck)

  //Creando span
  const spanTitle = document.createElement("span");
  spanTitle.innerText = taskName;

  //Creando icono de trash
  let iTrash = document.createElement("i");
  iTrash.classList.add("fa-solid", "fa-trash", "trash");
  //El ícono tendrá un identificador que servirá para borrar la tarea
  iTrash.setAttribute("task-id", id);
  iTrash.addEventListener("click", deleteTask);

  //Aplicando todos los elementos dentro de HTML
  ul.appendChild(li);
  li.appendChild(iCheck);
  li.appendChild(spanTitle);
  li.appendChild(iTrash);
}

//Lista de las fechas sin repetición
const uniqueDates = (taskList) => {
  const dateList = [];
  //Se agrega cada fecha de la lista de tareas, siempre y cuando aún no figure en la lista de fechas. Esto permite ordenar las tareas por fecha
  taskList.forEach((element) => {
    if (!dateList.includes(element.dateFormate)) {
      dateList.push(element.dateFormate);
    }
  });

  return dateList;
};

//La siguiente función imprime las tareas ordenandolas en bloques por fechas y de manera ascendente
function showTaskList() {
    //Primero se vacia el contenedor para evitar que lista se duplique
    ul.innerHTML = "";

    //Obtengo una lista de fechas y las ordeno de menor a mayor
    const list = uniqueDates(taskList);
    list.sort();

    //Primero imprimo la fecha y debajo de ella todas las tareas que tengan el mismo valor de fecha
    list.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("task-date");
        li.innerText= element;
        ul.appendChild(li)


        taskList.forEach((task) => {

            if(element === task.dateFormate){
                createTask(task.taskName, task.dateFormate, task.id, task.complete);

            }
        });

    });
  
}

//Cada vez que la página se recarga se manda a imprimir todo lo disponible en el localStorage
showTaskList();

//Función para eliminar tarea
function deleteTask(event){
    //Obtengo la posición de la tarea dntro de la lista de tareas a partir del id
    const element = event.target
    const id = element.getAttribute("task-id")
    const index = taskList.findIndex((item) => item.id === id)

    //Con el index, elimino la tarea de la lista de tareas
    taskList.splice(index, 1)
    //Actualizo el localStorage
    localStorage.setItem("task", JSON.stringify(taskList));
    showTaskList();
    
}

//Función para marcar y desmarcar una tarea
function checkUncheck(event){
  //Obtengo la posición de la tarea dntro de la lista de tareas a partir del id
    const element = event.target
    const id = element.getAttribute("check-id")
    const index = taskList.findIndex((item) => item.id === id)

    let status = taskList[index].complete;

    //Dependiendo de si la tarea está completa o no, cambio las clases, modifico el estado de la tarea y actualizo el localStorage
    if(status === false){
        element.classList.add("fa-solid")
        element.classList.remove("fa-regular")
        taskList[index].complete = true;
        localStorage.setItem("task", JSON.stringify(taskList));
    }else{
        element.classList.add("fa-regular")
        element.classList.remove("fa-solid")
        taskList[index].complete = false;
        localStorage.setItem("task", JSON.stringify(taskList));
    }

    
}