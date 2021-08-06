
const form = document.querySelector('#form_task');

const todoRef = db.collection('todos');
const mytask =  document.querySelector('#task');
const btnadd = document.querySelector('#btnadd');
const btnupdate = document.querySelector('#btnupdate');


// using onSnapShot Realtime Listener
todoRef.orderBy('task').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();

    changes.forEach(task => {
        if(task.type == 'added') {

            renderTask(task);
        } 

        if(task.type == 'modified') {

         document.querySelector('#d_task-'+task.doc.id).firstElementChild.innerHTML = task.doc.data().task // update the value of this element
         toastSuccess('Task Updated');

        }

        if(task.type == 'removed') {
            document.querySelector('#d_task-'+task.doc.id).remove()
            toastSuccess('Task Deleted');
        }

    })

})

// index
function renderTask(val) {
    let output = `<tr id='d_task-${val.doc.id}' ondblclick='editTask("${val.doc.id}")'>
                        <td class='pl-2 text-lowercase'> ${val.doc.data().task} </td>
                        <td> <a class='text-warning font-weight-bold text-decoration-none' href='javascript:void(0)' onclick='deleteTask("${val.doc.id}")'>
                            <i class='fas fa-times'> </i>
                        </a> </td>
                  </tr>`

                  document.querySelector('#d_task').innerHTML += output ;
}

// store (promised base)

function addTask(e) {

    e.preventDefault();

    todoRef.add({
        task : form.task.value
    })
    .then(response =>    toastSuccess('Task Added'));

    form.task.value = '';
}



function editTask(task) {

        const selected_task = document.querySelector('#d_task-'+task).firstElementChild.innerHTML.trim() ;

        mytask.value = selected_task // attach the fetch value to this el
        btnadd.style.display = 'none';
        btnupdate.style.display = 'block';

        btnupdate.setAttribute('data-id', task);

}

function updateTask(e) {

    e.preventDefault();

    const id =  btnupdate.getAttribute('data-id');

    todoRef.doc(id).update({
        task: mytask.value
    })
    mytask.value = "";
    btnadd.style.display = 'block';
    btnupdate.style.display = 'none';
}

// destroy
function deleteTask(task) {
    todoRef.doc(task).delete()
}

// check if the form_field is empty then revert to default value

mytask.onkeydown = function(event) {
    if(event.keyCode == 8) {
        if(mytask.value == "" || mytask == null) {

            btnadd.style.display = 'block';
            btnupdate.style.display = 'none';
            btnupdate.removeAttribute('data-id');

        }

    }
}






function toastSuccess(message)
{
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    Command: toastr["success"](`${message} Successfully`, "Success")

}



// without using onSnapShot . 
//  function getTask() {
//      let output = ``;

//      todoRef.orderBy('task').get().then(data => {
//          data.forEach(task => {
//               output += `<tr> 
//                             <td> ${task.data().task} </td>
//                             <td> <a class='text-dark font-weight-bold text-decoration-none' href='javascript:void(0)' onclick='deleteTask("${task.id}")'> x </a> </td>
//                          </tr>`
                       
//          })

//         document.querySelector('#d_task').innerHTML = output;
//      })

// }