# Scholarship Application Feature

This document describes the scholarship application feature that has been added to the system.

## Overview

The scholarship application system allows users to apply for scholarships by submitting their information along with required documents. The system validates user data against existing user records and manages the application status.

## Database Schema

### Scholarship Model

The `Scholarship` model includes the following fields:

```javascript
{
  fullName: String (required),
  cnic: String (required, unique, 13 digits),
  rollNumber: String (required, format: HM-YYYY-XXXX),
  email: String (required, lowercase),
  mobileNumber: String (required, 11 digits),
  challanNumber: String (required),
  imagePath: String (required),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  appliedAt: Date (default: current timestamp),
  timestamps: true
}
```

## API Endpoints

### 1. Apply for Scholarship
**POST** `/api/scholarship/apply`

**Description**: Submit a new scholarship application

**Content-Type**: `multipart/form-data`

**Required Fields**:
- `fullName`: Full name of the applicant
- `cnic`: 13-digit CNIC number
- `rollNumber`: Roll number in format HM-YYYY-XXXX
- `email`: Valid email address
- `mobileNumber`: 11-digit mobile number
- `challanNumber`: Challan number
- `image`: Image file (max 5MB, image formats only)

**Validation**:
- User must exist with the provided roll number
- User data (email, cnic, fullName) must match registered user
- No duplicate applications for same CNIC or roll number
- Image file is required

**Response**:
```json
{
  "message": "Scholarship application submitted successfully",
  "scholarship": {
    "id": "scholarship_id",
    "fullName": "John Doe",
    "rollNumber": "HM-2024-1234",
    "email": "john@example.com",
    "status": "pending",
    "appliedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Check Scholarship Status
**GET** `/api/scholarship/check/:rollNumber`

**Description**: Check scholarship application status by roll number (public route)

**Response**:
```json
{
  "message": "Scholarship application retrieved successfully",
  "scholarship": {
    "id": "scholarship_id",
    "fullName": "John Doe",
    "cnic": "1234567890123",
    "rollNumber": "HM-2024-1234",
    "email": "john@example.com",
    "mobileNumber": "03001234567",
    "challanNumber": "CH123456",
    "imagePath": "/uploads/scholarship-1234567890.jpg",
    "status": "pending",
    "appliedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get All Scholarships (Admin)
**GET** `/api/scholarship/`

**Description**: Get all scholarship applications (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "message": "Scholarship applications retrieved successfully",
  "scholarships": [
    {
      "id": "scholarship_id",
      "fullName": "John Doe",
      "cnic": "1234567890123",
      "rollNumber": "HM-2024-1234",
      "email": "john@example.com",
      "mobileNumber": "03001234567",
      "challanNumber": "CH123456",
      "imagePath": "/uploads/scholarship-1234567890.jpg",
      "status": "pending",
      "appliedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Get Scholarship by ID (Admin)
**GET** `/api/scholarship/:id`

**Description**: Get specific scholarship application by ID (requires authentication)

**Headers**: `Authorization: Bearer <token>`

### 5. Update Scholarship Status (Admin)
**PUT** `/api/scholarship/:id/status`

**Description**: Update scholarship application status (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "status": "approved" // or "rejected" or "pending"
}
```

**Response**:
```json
{
  "message": "Scholarship status updated successfully",
  "scholarship": {
    "id": "scholarship_id",
    "status": "approved",
    // ... other fields
  }
}
```

### 6. Delete Scholarship (Admin)
**DELETE** `/api/scholarship/:id`

**Description**: Delete scholarship application (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "message": "Scholarship application deleted successfully"
}
```

## File Upload

### Image Upload Configuration

- **Storage**: Local file system (`uploads/` directory)
- **File Size Limit**: 5MB
- **Allowed Formats**: All image formats (jpg, png, gif, etc.)
- **Filename Format**: `scholarship-{timestamp}-{random}.{extension}`

### Example Upload

```javascript
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('cnic', '1234567890123');
formData.append('rollNumber', 'HM-2024-1234');
formData.append('email', 'john@example.com');
formData.append('mobileNumber', '03001234567');
formData.append('challanNumber', 'CH123456');
formData.append('image', imageFile);

fetch('/api/scholarship/apply', {
  method: 'POST',
  body: formData
});
```

## Validation Rules

### Full Name
- Required
- 2-100 characters

### CNIC
- Required
- Exactly 13 digits
- Must be unique

### Roll Number
- Required
- Format: HM-YYYY-XXXX
- Must match existing user

### Email
- Required
- Valid email format
- Must match registered user

### Mobile Number
- Required
- Exactly 11 digits

### Challan Number
- Required
- 1-50 characters

### Image
- Required
- Image file only
- Max 5MB

## Error Handling

### Common Error Responses

**Validation Error**:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "cnic",
      "message": "CNIC must be 13 digits"
    }
  ]
}
```

**User Not Found**:
```json
{
  "message": "User with this roll number not found"
}
```

**Data Mismatch**:
```json
{
  "message": "User data does not match with registered user"
}
```

**Duplicate Application**:
```json
{
  "message": "Scholarship application already exists for this CNIC"
}
```

**Image Required**:
```json
{
  "message": "Image is required"
}
```

## Security Features

1. **Authentication**: Admin routes require JWT authentication
2. **Data Validation**: Comprehensive input validation
3. **File Type Validation**: Only image files allowed
4. **File Size Limits**: 5MB maximum file size
5. **Unique Constraints**: Prevents duplicate applications
6. **User Verification**: Validates against existing user data

## Database Indexes

The following indexes are created for optimal performance:

- `rollNumber`: For quick lookups by roll number
- `cnic`: For unique constraint and lookups
- `email`: For email-based queries
- `status`: For filtering by application status

## Usage Examples

### Frontend Integration

```javascript
// Apply for scholarship
async function applyForScholarship(formData) {
  try {
    const response = await fetch('/api/scholarship/apply', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error applying for scholarship:', error);
  }
}

// Check application status
async function checkScholarshipStatus(rollNumber) {
  try {
    const response = await fetch(`/api/scholarship/check/${rollNumber}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking status:', error);
  }
}
```

### Admin Panel Integration

```javascript
// Get all applications
async function getAllScholarships(token) {
  try {
    const response = await fetch('/api/scholarship/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching scholarships:', error);
  }
}

// Update status
async function updateScholarshipStatus(id, status, token) {
  try {
    const response = await fetch(`/api/scholarship/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating status:', error);
  }
}
``` 