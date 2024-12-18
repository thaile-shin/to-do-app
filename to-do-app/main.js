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

// B6: Làm thêm tính năng chỉnh sửa
// B6.1: Bắt sự kiện onclick thẻ ul (tính chất của Bubble Event)
taskList.onclick = function(e) {
    // B6.4: Muốn có nội dung điền sẵn, ta lấy chỉ số trong mảng taske sau đó truy cập thuộc tính title trong phần tử. Vấn đề đặt ra là làm sao lấy đc chỉ số của phần tử trong mảng tasks => tham số thứ 2 của callbackFn là index.
    // tự tạo 1 attribute (task-index)
    // B6.5: lấy phần tử li cha từ phần tử con => dùng phương thức closest
    const taskItem = e.target.closest('.task-item');
    // B6.6: từ li tag => getAttribute sẽ lấy ra đc index + ép kiểu sang số.
    const taskIndex = +taskItem.getAttribute('task-index');
    const task = tasks[taskIndex];

    console.log(task)
    // B6.2 Kiểm tra 3 nút ng dùng bấm vào (e.target)
    if(e.target.closest('.edit')) {
        // B6.3: Bật prompt cho phép nhập công việc mới
        const newTitle = prompt("Nhập công việc mới...", task.title);
        // gán giá trị từ prompt cho task
        task.title = newTitle;
        render() // gọi lại để cập nhật giao diện
    }
    if(e.target.closest('.done')) {
        console.log('Mark as done/ Undone')
    }
    if(e.target.closest('.delete')) {
        console.log('Delete')
    }
}

// B2: Sau khi đưa ra đc cấu trúc dữ liệu => render ra giao diện

// B2.1: Chuyển Array sang chuỗi html, có cấu trúc giống file html => dùng Array.map() => trả về mảng có html có n phần tử, từ mảng trả về dùng Array.join() để trả về chuỗi

// B2.2: Sửa nhiệm vụ và trạng thái hoàn thành từ dữ liệu ở mảng Tasks => dùng nội suy, tiếp theo kiểm tra trạng thái Complete (dùng toán từ 3 ngôi)

// B4: thêm class "completed khi hoàn thành (toán tử 3 ngôi)"

// B5: Làm thêm chức năng thêm công việc, mỗi lần thêm công việc sẽ push dữ liệu vào trong tasks
// 5.1: Lấy thẻ form và bắt sự kiện Submit
// 5.2: Lấy phần tử input để lấy ra dữ liệu nhập từ người dùng
const toDoForm = document.querySelector('#todo-form');
const toDoInput = document.querySelector('#todo-input');

// bắt sự kiện Submit ở form
toDoForm.addEventListener("submit", function(e) {
    // vô hiệu hóa mặc định của trình duyệt khi submit
    e.preventDefault();
    // lấy dữ liệu người dùng nhập vào input, loại bỏ khoảng trắng thừa ở đầu chuỗi và cuối chuỗi
    const value = toDoInput.value.trim();

    if(!value) {
        alert("Hãy nhập lại công việc");
        return; // thoát hàm tránh chạy logic bên dưới
    }

    // tạo công việc mới theo định dạng có sẵn
    const newTasks = {
        title: value,
        completed: false,
    }

    // đưa công việc mới vào bên trong danh sách công việc

    tasks.push(newTasks);
    // Đưa code bài trước lên sau khi push công việc để nó render ra giao diện

    // re-render
    render();

    toDoInput.value = '';
});
// lặp code => tạo hàm riêng

// Vô hiệu hóa sự kiện mặc định khi nhấn chuôt: lấy ra #button, bắt sự kiện mousedown, dùng preventDefault();

function render() {
    const html = tasks.map((task, index)=> `
        <li class="task-item ${task.completed ? 'completed' : ''}" task-index="${index}">
            <span class="task-title">${task.title}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${task.completed ? 'Mark as undone' : 'Mark as done'}</button>
                <button class="task-btn delete">Delete</button>
            </div>
        </li>
    `).join("");
    taskList.innerHTML = html;
}
 render(); // gọi hàm để code chạy ngay khi có sẵn dữ liệu