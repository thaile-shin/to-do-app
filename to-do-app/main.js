// Do công việc được thể hiện dưới dạng danh sách => Array

const tasks = JSON.parse(localStorage.getItem("tasks")) ?? []; // lấy dữ liệu từ localStorage để render ra giao diện, nếu chưa có dữ liệu mặc định trả về mảng rỗng (dùng toán tử nullish coalescing)

// B3: đưa vào trong task-list
const taskList = document.querySelector("#tasks-list");
// B5: Làm thêm chức năng thêm công việc, mỗi lần thêm công việc sẽ push dữ liệu vào trong tasks
// 5.1: Lấy thẻ form và bắt sự kiện Submit
// 5.2: Lấy phần tử input để lấy ra dữ liệu nhập từ người dùng
const toDoForm = document.querySelector("#todo-form");
const toDoInput = document.querySelector("#todo-input");

// Tối ưu hàm check trùng lặp
// những giá trị k nằm sẵn trong hàm, tách riêng thành tham số trong hàm
function isDuplicateTask(newTitle, excludeIndex = -1) {
    const checkDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() &&
            excludeIndex !== index
    );
    return checkDuplicate;
}

// tạo hàm lưu dữ liệu
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// B6: Làm thêm tính năng chỉnh sửa
// B6.1: Bắt sự kiện onclick thẻ ul (tính chất của Bubble Event)
function handleTaskActions(e) {
    // B6.4: Muốn có nội dung điền sẵn, ta lấy chỉ số trong mảng tasks sau đó truy cập thuộc tính title trong phần tử. Vấn đề đặt ra là làm sao lấy đc chỉ số của phần tử trong mảng tasks => tham số thứ 2 của callbackFn là index.
    // tự tạo 1 attribute (data-index)
    // B6.5: lấy phần tử li cha từ phần tử con phát ra sự kiện => dùng phương thức closest
    const taskItem = e.target.closest(".task-item");
    if(!taskItem) return;
    // B6.6: từ li tag => getAttribute sẽ lấy ra đc index + ép kiểu sang số.
    // const taskIndex = +taskItem.getAttribute("data-index");
    const taskIndex = +taskItem.dataset.index;
    const task = tasks[taskIndex];

    // B6.2 Kiểm tra 3 nút ng dùng bấm vào (e.target)
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
        // check khi công việc trùng lặp => dùng phương thức some so sánh với newTitle. Quan trọng nhất là phải loại trừ chính dòng đang sửa.
        // const checkDuplicate = tasks.some((task, index) =>
        //     task.title.toLowerCase() === newTitle.toLowerCase() &&
        //     taskIndex !== index
        // );
        if (isDuplicateTask(newTitle, taskIndex)) {
            alert(
                "Task with this title has already exist. Please enter a different task!"
            );
            return;
        }
        // gán giá trị từ prompt cho task
        task.title = newTitle;
        saveTasks();
        renderTask(); // gọi lại để cập nhật giao diện

        // B7: Xây dựng chức năng đánh dấu hoàn thành/chưa hoàn thành
    }
    if (e.target.closest(".done")) {
        task.completed = !task.completed;
        renderTask();
        saveTasks();
        return;
    }
    // B8: Xây dựng chức năng xóa công việc => tương tác với mảng (thêm là push hoặc unshift, xóa dùng splice vì ở đây mình sẽ k biết xóa từ phần từ nào-chính là chỉ số start trong phương thức)
    if (e.target.closest(".delete")) {
        if (confirm(`Are you sure you want to delete '${task.title}' ?`)) {
            tasks.splice(taskIndex, 1);
            renderTask();
            saveTasks();
        }
    }
}

// B2: Sau khi đưa ra đc cấu trúc dữ liệu => render ra giao diện

// B2.1: Chuyển Array sang chuỗi html, có cấu trúc giống file html => dùng Array.map() => trả về mảng có html có n phần tử, từ mảng trả về dùng Array.join() để trả về chuỗi

// B2.2: Sửa nhiệm vụ và trạng thái hoàn thành từ dữ liệu ở mảng Tasks => dùng nội suy, tiếp theo kiểm tra trạng thái Complete (dùng toán từ 3 ngôi)

// B4: thêm class "completed khi hoàn thành (toán tử 3 ngôi)"

// bắt sự kiện Submit ở form
function addTask(e) {
    // vô hiệu hóa mặc định của trình duyệt khi submit
    e.preventDefault();
    // lấy dữ liệu người dùng nhập vào input, loại bỏ khoảng trắng thừa ở đầu chuỗi và cuối chuỗi
    const value = toDoInput.value.trim();

    if (!value) {
        alert("Please enter a new task");
        return; // thoát hàm tránh chạy logic bên dưới
    }
    // dùng phương thức some để kiểm tra xem trong task có trùng với value nhập vào không
    // const isDuplicate = tasks.some(task => task.title.toLowerCase() === value.toLowerCase());

    if (isDuplicateTask(value)) {
        alert("Please enter other task");
        return;
    }

    // đưa công việc mới vào bên trong danh sách công việc
    tasks.push({
        title: value,
        completed: false,
    });
    // Đưa code bài trước lên sau khi push công việc để nó render ra giao diện

    // re-render
    renderTask();
    saveTasks();

    toDoInput.value = "";
}
// lặp code => tạo hàm riêng

// Vô hiệu hóa sự kiện mặc định khi nhấn chuôt: lấy ra #button, bắt sự kiện mousedown, dùng preventDefault();

function renderTask() {
    if (!tasks.length) {
        taskList.innerHTML = `<li class="empty-message">No Task Available...</li>`;
        return;
    }
    const html = tasks
        .map(
            (task, index) => `<li class="task-item ${
                task.completed ? "completed" : ""
            }" data-index="${index}">
            <span class="task-title">${task.title}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${
                    task.completed ? "Mark as undone" : "Mark as done"
                }</button>
                <button class="task-btn delete">Delete</button>
            </div>
        </li>`
        )
        .join("");
    taskList.innerHTML = html;
}
renderTask(); // gọi hàm để code chạy ngay khi có sẵn dữ liệu

toDoForm.addEventListener("submit", addTask); // xử lý hành động thêm task

taskList.addEventListener("click", handleTaskActions); // xử lý hành động task

// Tìm hiểu: Định dạng dữ liệu JSON, localStorage
