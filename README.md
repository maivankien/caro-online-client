# Caro Online Client

Ứng dụng client cho game Caro Online được xây dựng với React + TypeScript + Vite.

## 🏗️ Cấu trúc thư mục

```
src/
├── components/           # Các React components
├── pages/               # Các trang chính
│   ├── HomePage.tsx     # Trang đăng nhập/tạo guest user
│   └── GamePage.tsx     # Trang game chính
├── hooks/              # Custom React hooks
│   └── useApi.hook.ts  # Hook quản lý guest authentication (tối ưu)
├── services/           # API services
│   └── api.service.ts  # Service gọi API với axios
├── types/              # TypeScript type definitions
│   └── api.types.ts    # Types cho API responses
├── config/             # Configuration files
│   └── api.config.ts   # Cấu hình API endpoints
├── styles/             # CSS styles
│   └── pages/          # Styles cho từng trang
│       ├── HomePage.css
│       └── GamePage.css
└── assets/             # Static assets
```

## 🚀 Tính năng

### Trang chủ (/) - Đăng nhập
- ✅ Nhập tên người dùng
- ✅ Tạo guest user qua API
- ✅ Tự động chuyển hướng đến trang game sau khi tạo thành công
- ✅ Kiểm tra và chuyển hướng nếu đã đăng nhập
- ✅ Loading states và error handling
- ✅ Responsive design

### Trang Game (/game) - Dashboard
- ✅ Hiển thị thông tin người dùng đã đăng nhập
- ✅ Bảo vệ route (redirect về trang chủ nếu chưa đăng nhập)
- ✅ Các nút action cho game (Bắt đầu chơi, Tìm phòng, Tạo phòng)
- ✅ Chức năng đăng xuất
- ✅ Responsive design

### Công nghệ sử dụng
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **CSS3** - Styling với gradient và animations

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 🔧 Cấu hình API

Cập nhật file `src/config/api.config.ts` để thay đổi API endpoint:

```typescript
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
}
```

## 📝 Quy tắc code

- Code không có dấu `;` (trừ import statements)
- Sử dụng 4 spaces cho indentation
- Interface TypeScript có tiền tố `I` (ví dụ: `IUser`, `IAuthResponse`)
- File naming: kebab-case cho CSS, camelCase cho TS/TSX
- Thư mục được tổ chức theo chức năng

## 🎯 API Endpoint

API sử dụng endpoint local:
- `POST /api/auth/guest` - Tạo guest user và nhận token

### Request Format:
```json
{
    "name": "Tên người dùng"
}
```

### Response Format:
```json
{
    "data": {
        "user": {
            "id": "uuid",
            "name": "Tên người dùng",
            "isGuest": 1
        },
        "token": "JWT_TOKEN"
    },
    "message": "Guest user created and authenticated successfully",
    "statusCode": 201
}
```

## 🔐 Authentication & Navigation

- Token được lưu trong localStorage với key `authToken`
- Thông tin user được lưu trong localStorage với key `user`
- Tự động chuyển hướng đến `/game` ngay sau khi tạo user thành công
- Route protection: `/game` yêu cầu authentication, redirect về `/` nếu chưa đăng nhập
- Tự động redirect đến `/game` nếu đã đăng nhập khi truy cập `/`
- Có thể đăng xuất từ trang game để quay về trang chủ

## 🛣️ Routes

- `/` - Trang chủ (đăng nhập/tạo guest user)
- `/game` - Trang game chính (yêu cầu authentication)
