# Corn Disease Identification 

Backend API untuk aplikasi identifikasi penyakit pada daun jagung menggunakan Express.js, Prisma, dan PostgreSQL.

## Features

- **Authentication & Authorization**
  - User registration dan login
  - JWT-based authentication
  - Role-based access control (USER/ADMIN)

- **Disease Management**
  - CRUD operations untuk penyakit
  - Reference image management
  - Disease information dengan symptoms dan treatment

- **Scan Functionality**
  - Image upload dan processing
  - ML-based disease prediction
  - Scan history untuk authenticated users
  - Anonymous scanning (tanpa save history)

- **Admin Dashboard**
  - User management
  - Scan history monitoring
  - Disease dan reference image management
  - Dashboard statistics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## API Endpoints
```bash

Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile

Diseases
GET /api/diseases - Get all diseases
GET /api/diseases/:id - Get disease by ID
POST /api/diseases - Create disease (Admin only)
PUT /api/diseases/:id - Update disease (Admin only)
DELETE /api/diseases/:id - Delete disease (Admin only)

Scan
POST /api/scan - Scan image (Public dengan optional auth)
GET /api/scan/history - Get scan history (Auth required)
GET /api/scan/history/:id - Get scan by ID (Auth required)
DELETE /api/scan/history/:id - Delete scan (Auth required)

User
PUT /api/user/profile - Update profile
PUT /api/user/change-password - Change password
GET /api/user/stats - Get user statistics

Admin
GET /api/admin/dashboard - Dashboard statistics
GET /api/admin/users - Get all users
PUT /api/admin/users/:id/role - Update user role
DELETE /api/admin/users/:id - Delete user
GET /api/admin/scan-history - Get all scan history
DELETE /api/admin/scan-history/:id - Delete scan history
POST /api/admin/reference-images - Upload reference image
DELETE /api/admin/reference-images/:id - Delete reference image