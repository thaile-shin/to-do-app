// Do công việc được thể hiện dưới dạng danh sách => Array

const tasks = [
    // B1: dùng Obj để mô tả công việc
    // {
    //     title: "Học JS Pro F8",
    //     completed: true,
    // },
    // {
    //     title: "Quét nhà",
    //     completed: false,
    // },
    // {
    //     title: "Rửa bát",
    //     completed: false,
    // }
]

// B3: đưa vào trong task-list
const taskList = document.querySelector('#tasks-list');

// B2: Sau khi đưa ra đc cấu trúc dữ liệu => render ra giao diện

// B2.1: Chuyển Array sang chuỗi html, có cấu trúc giống file html => dùng Array.map() => trả về mảng có html có n phần tử, từ mảng trả về dùng Array.join() để trả về chuỗi

// B2.2: Sửa nhiệm vụ và trạng thái hoàn thành từ dữ liệu ở mảng Tasks => dùng nội suy, tiếp theo kiểm tra trạng thái Complete (dùng toán từ 3 ngôi)

// B4: thêm class "completed khi hoàn thành (toán tử 3 ngôi)"

// B5: Làm thêm chức năng thêm công việc, mỗi lần thêm công việc sẽ push dữ liệu vào trong tasks
// const toDoInput = document.querySelector('#todo-input');
// const submit = document.querySelector('#submit');

// toDoInput.onchange = function () {
    
// }

// submit.onclick = function () {
//     tasks.push (123);
//     console.log(tasks);
// }

const html = tasks.map(task => `
    <li class="task-item ${task.completed ? 'completed' : ''}">
        <span class="task-title">${task.title}</span>
        <div class="task-action">
            <button class="task-btn edit">Edit</button>
            <button class="task-btn done">${task.completed ? 'Mark as undone' : 'Mark as done'}</button>
            <button class="task-btn delete">Delete</button>
        </div>
    </li>
`).join("");

taskList.innerHTML = html;

console.log(html);