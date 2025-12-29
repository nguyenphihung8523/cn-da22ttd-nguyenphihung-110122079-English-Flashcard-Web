# English Flashcard Web

Ứng dụng học tiếng Anh toàn diện với flashcard, quiz, và luyện nói. Giao diện tiếng Việt, chạy offline trên localhost.

## Giới thiệu

English Flashcard Web là một nền tảng học tập tương tác giúp người dùng Việt Nam:
- Học từ vựng tiếng Anh qua flashcard
- Kiểm tra kiến thức với quiz
- Luyện phát âm qua bài tập nói
- Theo dõi tiến độ học tập
- Quản lý danh sách từ yêu thích và từ sai

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy cài đặt:
- **Node.js** (phiên bản LTS mới nhất) - [Tải tại đây](https://nodejs.org/)
- **MongoDB Community** (chạy local) - [Tải tại đây](https://www.mongodb.com/try/download/community)

Kiểm tra cài đặt:
```bash
node --version
npm --version
mongod --version
```

## Hướng dẫn cài đặt

### Bước 1: Clone hoặc tải dự án

```bash
# Nếu dùng Git
git clone <repository-url>
cd English-Flashcard-Web

# Hoặc tải file ZIP và giải nén
```

### Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:
```bash
# Windows (Command Prompt)
copy .env.example .env

# hoặc macOS/Linux
cp .env.example .env
```

Chỉnh sửa file `.env` nếu cần (thường không cần thay đổi):
```
MONGO_URI=mongodb://127.0.0.1:27017/english_flashcard_db
JWT_SECRET=secretkey123
PORT=5000
```

Khởi động Backend:
```bash
npm run dev
```

Bạn sẽ thấy thông báo: `Server running on port 5000`

### Bước 3: Cài đặt Frontend

Mở terminal mới (giữ Backend chạy):
```bash
cd frontend
npm install
npm start
```

Frontend sẽ tự động mở tại: http://localhost:3000

### Bước 4: Tạo tài khoản Admin (tùy chọn)

Mở terminal mới và chạy:
```bash
cd backend
node createTestUser.js
```

Tài khoản Admin:
- Username: `admin123`
- Password: `123456`

## Sử dụng ứng dụng

### Đăng ký tài khoản mới
1. Truy cập http://localhost:3000
2. Nhấp "Đăng ký"
3. Nhập username, email, mật khẩu
4. Nhấp "Đăng ký"

### Đăng nhập
1. Nhập username hoặc email và mật khẩu
2. Nhấp "Đăng nhập"

### Học flashcard
1. Chọn "Flashcard" từ menu
2. Chọn mức độ (Cơ bản, Trung cấp, Nâng cao, v.v.)
3. Xem từ vựng và định nghĩa
4. Đánh dấu yêu thích hoặc ghi nhớ từ sai

### Làm quiz
1. Chọn "Quiz" từ menu
2. Chọn chủ đề hoặc mức độ
3. Trả lời các câu hỏi trắc nghiệm
4. Xem kết quả và giải thích

### Luyện nói
1. Chọn "Luyện nói" từ menu
2. Nghe phát âm chuẩn
3. Ghi âm và so sánh
4. Nhận phản hồi

### Xem tiến độ
1. Chọn "Thống kê" hoặc "Hồ sơ"
2. Xem số từ đã học, quiz đã làm
3. Theo dõi mức độ tiến bộ

## Cấu trúc dự án

```
English-Flashcard-Web/
├── backend/                 # API Server (Node.js + Express)
│   ├── config/             # Cấu hình database
│   ├── controllers/        # Xử lý logic API
│   ├── models/             # Schema MongoDB
│   ├── middleware/         # Xác thực JWT
│   ├── routes/             # Định tuyến API
│   ├── .env                # Biến môi trường
│   └── server.js           # Điểm khởi động
│
├── frontend/               # React App
│   ├── public/            # File tĩnh
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Trang chính
│   │   ├── services/      # API calls
│   │   ├── context/       # State management
│   │   └── App.js         # Điểm khởi động
│   └── package.json
│
└── README.md              # File này
```

## Công nghệ sử dụng

**Frontend:**
- React 18.2
- React Router DOM v6
- Tailwind CSS 3.4
- Axios

**Backend:**
- Node.js + Express 4.18
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (mã hóa mật khẩu)

## Khắc phục sự cố

### Backend không khởi động
```bash
# Kiểm tra MongoDB đang chạy
mongod

# Kiểm tra port 5000 có bị chiếm không
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000

# Xóa node_modules và cài lại
cd backend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Frontend không kết nối Backend
- Kiểm tra Backend đang chạy tại http://localhost:5000
- Kiểm tra file `.env` trong backend có đúng không
- Xóa cache browser (Ctrl+Shift+Delete)

### Lỗi "Cannot find module"
```bash
# Cài lại dependencies
npm install

# Hoặc xóa node_modules và cài lại
rm -r node_modules package-lock.json
npm install
```

### MongoDB không kết nối
```bash
# Kiểm tra MongoDB đang chạy
# Windows: Mở Services và tìm MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Nếu chưa chạy, khởi động:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

## Tính năng chính

- ✅ Đăng ký/Đăng nhập với JWT
- ✅ Quản lý flashcard (Thêm, sửa, xóa)
- ✅ Quiz trắc nghiệm
- ✅ Luyện phát âm
- ✅ Theo dõi tiến độ
- ✅ Danh sách yêu thích
- ✅ Ghi nhớ từ sai
- ✅ Phân cấp mức độ (Cơ bản → Chuyên biệt)

## Phát triển tiếp theo

Dự án này là nền tảng để bạn tiếp tục phát triển:
- Thêm tính năng mới (ví dụ: học theo chủ đề)
- Cải thiện UI/UX
- Tối ưu hóa hiệu suất
- Thêm kiểm tra lỗi chính tả
- Tích hợp API phát âm nâng cao

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước cài đặt
2. Xem phần "Khắc phục sự cố"
3. Kiểm tra console (F12) để xem lỗi chi tiết
4. Kiểm tra terminal Backend để xem lỗi API

## Ghi chú

- Ứng dụng chạy offline trên localhost, không cần internet
- Dữ liệu được lưu trên MongoDB local
- Mật khẩu được mã hóa an toàn
- JWT token hết hạn sau 24 giờ
