// lấy dữ liệu từ localStorage để render ra giao diện, nếu chưa có dữ liệu mặc định trả về mảng rỗng (dùng toán tử nullish coalescing)
const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

// Truy cập vào các phần tử trong DOM
const taskList = document.querySelector("#tasks-list"); // Danh sách công việc
const toDoForm = document.querySelector("#todo-form"); // Form thêm công việc
const toDoInput = document.querySelector("#todo-input"); // Input để nhập tên công việc

// Hàm để escape HTML nhằm ngăn ngừa XSS
function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html; // Gán nội dung vào thẻ div để tự động escape các ký tự HTML (html entities)
    return div.innerHTML; // Trả về nội dung đã được escape
}

// Kiểm tra xem tiêu đề công việc mới có bị trùng lặp không
function isDuplicateTask(newTitle, excludeIndex = -1) {
    const checkDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() && // So sánh không phân biệt chữ hoa/thường
            excludeIndex !== index // Loại trừ công việc đang chỉnh sửa
    );
    return checkDuplicate;
}

// Lưu danh sách công việc vào localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Xử lý các hành động trên công việc (sửa, đánh dấu hoàn thành, xóa)
function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item"); // Tìm công việc tương ứng với nút được bấm
    if (!taskItem) return;

    const taskIndex = +taskItem.dataset.index; // Lấy chỉ mục của công việc
    const task = tasks[taskIndex]; // Lấy công việc từ danh sách

    // Sửa tiêu đề công việc
    if (e.target.closest(".edit")) {
        // B6.3: Bật prompt cho phép nhập công việc mới
        let newTitle = prompt("Enter new task ...", task.title);
        // check khi cancel prompt
        if (newTitle === null) return;
        // check khi ng dùng k nhập gì hoặc nhập toàn khoảng trắng
        newTitle = newTitle.trim();
        if (!newTitle) {
            alert("Task title is not empty!");
            return;
        }

        if (isDuplicateTask(newTitle, taskIndex)) {
            alert(
                "Task with this title has already exist. Please enter a different task!"
            ); // cảnh báo nếu tiêu đề trùng lặp
            return;
        }

        task.title = newTitle; // cập nhật tiêu đề mới công việc
        saveTasks(); // lưu danh sách vào localStorage
        renderTask(); // Hiển thị danh sách công việc
    }

    // đánh dấu hoàn thành/ chưa hoàn thành
    if (e.target.closest(".done")) {
        task.completed = !task.completed; // đảo trạng thái hoàn thành
        renderTask();
        saveTasks();
        return;
    }
    // Xóa công việc
    if (e.target.closest(".delete")) {
        if (confirm(`Are you sure you want to delete '${task.title}' ?`)) {
            tasks.splice(taskIndex, 1);
            renderTask();
            saveTasks();
        }
    }
}
// thêm công việc mới
function addTask(e) {
    e.preventDefault(); // vô hiệu hóa mặc định của trình duyệt khi submit
    const value = toDoInput.value.trim(); // lấy giá trị input, loại bỏ khoảng trắng thừa.

    if (!value) {
        alert("Please enter a new task");
        return;
    } // Cảnh báo nếu input rỗng

    if (isDuplicateTask(value)) {
        alert("Please enter other task");
        return;
    } // cảnh báo nếu trùng lặp

    // đưa công việc mới vào bên trong danh sách công việc
    tasks.push({
        title: value,
        completed: false,
    });
    renderTask(); // hiển thị danh sách công việc
    saveTasks(); // lưu vào localStorage

    toDoInput.value = ""; // xóa giá trị input sau khi submit
}
// Hàm hiển thị danh sách công việc
function renderTask() {
    if (!tasks.length) {
        taskList.innerHTML = `<li class="empty-message">No Task Available...</li>`; // Hiển thị thông báo nếu danh sách rỗng
        return;
    }
    const html = tasks
        .map(
            (task, index) => `
            <li class="task-item ${
                task.completed ? "completed" : "" // Thêm class "completed" nếu công việc đã hoàn thành
            }" data-index="${index}">
                <span class="task-title">${escapeHTML(task.title)}</span> <!-- Escape tiêu đề công việc -->
                <div class="task-action">
                    <button class="task-btn edit">Edit</button> <!-- Nút sửa -->
                    <button class="task-btn done">${
                    task.completed ? "Mark as undone" : "Mark as done"
                }</button> <!-- Nút hoàn thành -->
                    <button class="task-btn delete">Delete</button> <!-- Nút xóa -->
                </div>
            </li>`
        )
        .join(""); // Kết hợp tất cả các phần tử thành một chuỗi HTML
    taskList.innerHTML = html; // Chèn HTML vào danh sách
}

// Cách khác dùng createElement và appendChild.
// function renderTask() {
//     if(!tasks.length) {
//         const emptyMessage = document.createElement("li");
//         emptyMessage.className = "empty-message";
//         emptyMessage.textContent = "No Task Available...";
//         taskList.appendChild(emptyMessage);
//         return;
//     }

//     const taskElements = tasks.map((task, index) => {
//         const $ = document.createElement.bind(document)
//         const taskItem = $('li');
//         taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
//         taskItem.dataset.index = index;

//         const taskTitle = $('span');
//         taskTitle.className = 'task-title';
//         taskTitle.innerText = task.title;
//         taskItem.appendChild(taskTitle);

//         const taskAction = $('div');
//         taskAction.className = 'task-action';

//         const taskBtnEdit = $('button');
//         taskBtnEdit.className = 'task-btn edit';
//         taskBtnEdit.textContent = 'Edit';
//         taskAction.appendChild(taskBtnEdit);

//         const taskBtnDone = $('button');
//         taskBtnDone.className = `task-btn done`;
//         taskBtnDone.textContent = `${task.completed ? "Mark as undone" : "Mark as done"}`;
//         taskAction.appendChild(taskBtnDone);

//         const taskBtnDelete = $('button');
//         taskBtnDelete.className = `task-btn delete`;
//         taskBtnDelete.textContent = 'Delete';
//         taskAction.appendChild(taskBtnDelete);

//         taskItem.appendChild(taskAction);
//         return taskItem;
//     });

//     taskElements.forEach(taskElement => taskList.appendChild(taskElement));
// }

// Lắng nghe sự kiện submit của form
toDoForm.addEventListener("submit", addTask);
// Lắng nghe sự kiện click trên danh sách công việc
taskList.addEventListener("click", handleTaskActions);
// Hiển thị danh sách công việc khi tải trang
renderTask();
