# Roll Number Feature

This document describes the roll number feature that has been added to the user system.

## Overview

Every user now gets a unique roll number automatically assigned during signup. The roll number follows a specific format and is guaranteed to be unique across all users.

## Roll Number Format

Roll numbers follow the format: `HM-YYYY-XXXX`

- `HM`: Stands for "Hunarmand"
- `YYYY`: Current year (4 digits)
- `XXXX`: Random 4-digit number (1000-9999)

Example: `HM-2024-1234`

## Implementation Details

### Database Schema Changes

The `User` model has been updated to include a `rollNumber` field:

```javascript
rollNumber: {
  type: String,
  unique: true,
  required: true,
}
```

### Roll Number Generation

A static method `generateRollNumber()` has been added to the User model that:

1. Generates a roll number in the format `HM-YYYY-XXXX`
2. Checks if the roll number already exists in the database
3. If it exists, generates a new one until a unique roll number is found
4. Returns the unique roll number

### Signup Process Changes

The signup process now:

1. Generates a unique roll number using `User.generateRollNumber()`
2. Assigns the roll number to the new user
3. Returns the roll number in the signup response

### API Response Changes

The following API endpoints now include the roll number in their responses:

- **POST /api/auth/signup**: Returns roll number in the user object
- **POST /api/auth/login**: Returns roll number in the user object  
- **POST /api/bank/inquery**: Returns roll number in the response

## Migration for Existing Users

If you have existing users without roll numbers, you can run the migration script:

```bash
npm run migrate:rollnumbers
```

This script will:
1. Find all users without roll numbers
2. Generate unique roll numbers for each user
3. Save the roll numbers to the database

## Testing

You can test the roll number generation functionality:

```bash
npm run test:rollnumbers
```

This will:
1. Generate 5 test roll numbers
2. Verify they are all unique
3. Verify they follow the correct format

## Usage Examples

### Signup Response
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "rollNumber": "HM-2024-5678",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### Login Response
```json
{
  "message": "Logged in successfully",
  "token": "jwt_token_here",
  "user": {
    "rollNumber": "HM-2024-5678",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### Bank Inquiry Response
```json
{
  "message": "Challan found successfully",
  "status": "success",
  "responseCode": 200,
  "amount": "1000",
  "challanId": "12345678",
  "fullName": "John Doe",
  "cnic": "1234567890123",
  "mobile": "03001234567",
  "fatherName": "Father Name",
  "rollNumber": "HM-2024-5678"
}
```

## Error Handling

- If a roll number collision occurs during generation, the system will automatically generate a new roll number
- The unique constraint on the database ensures no duplicate roll numbers can be saved
- If the migration script encounters an error, it will log the error and continue with other users

## Security Considerations

- Roll numbers are not sensitive information and can be safely returned in API responses
- The generation algorithm uses random numbers to prevent predictable roll numbers
- The unique constraint prevents any possibility of duplicate roll numbers 