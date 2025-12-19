# MongoDB Atlas Setup Instructions

## Current Issue
MongoDB Atlas authentication is failing with error: "bad auth : authentication failed"

## Tested Connection Strings
❌ `mongodb+srv://pratiktown111_db_user:Pratik@111@cluster0.w8yjvwy.mongodb.net/`
❌ `mongodb+srv://pratiktown111_db_user:Pratik%40111@cluster0.w8yjvwy.mongodb.net/`
❌ `mongodb+srv://pratiktown111_db_user:Pratik111@cluster0.w8yjvwy.mongodb.net/`

## Steps to Fix MongoDB Atlas Connection

### 1. Check MongoDB Atlas Dashboard
Go to https://cloud.mongodb.com/ and verify:

**Database Access:**
- Click "Database Access" in left sidebar
- Verify user `pratiktown111_db_user` exists
- Check password is correct: `Pratik111` (without special characters)
- Ensure user has "Atlas admin" or "Read and write to any database" permissions

**Network Access:**
- Click "Network Access" in left sidebar
- Add IP Address: `0.0.0.0/0` (Allow access from anywhere) for development
- Or add your current IP address specifically

### 2. Create New Database User (Recommended)
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `webdev_user`
5. Password: `WebDev123` (simple, no special characters)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 3. Test Connection String Format
Use this format with the new user:
```
mongodb+srv://webdev_user:WebDev123@cluster0.w8yjvwy.mongodb.net/webdevhub?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Verify Cluster Status
- Go to "Clusters" in MongoDB Atlas
- Ensure cluster `cluster0` is running (not paused)
- Check cluster tier (M0 Sandbox should work for development)

### 5. Test with MongoDB Compass (Optional)
1. Download MongoDB Compass
2. Use connection string: `mongodb+srv://webdev_user:WebDev123@cluster0.w8yjvwy.mongodb.net/`
3. If it connects in Compass, the credentials are correct

## Current Working Solution
✅ **Temporary In-Memory Authentication System**
- Fully functional user registration and login
- Secure password hashing with bcrypt
- JWT token authentication
- All features working perfectly
- Data persists during server session

## To Switch to MongoDB
1. Fix the MongoDB Atlas configuration above
2. Update `backend/.env` with working connection string:
   ```
   MONGODB_URI=mongodb+srv://webdev_user:WebDev123@cluster0.w8yjvwy.mongodb.net/webdevhub?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Restart the server: `npm run dev`
4. Server will automatically use MongoDB instead of temporary storage

## Troubleshooting
If still failing:
1. Check MongoDB Atlas service status
2. Try connecting from a different network
3. Contact MongoDB Atlas support
4. Consider using a different MongoDB hosting service

## Alternative Solutions
1. **MongoDB Atlas (Different Region)**: Create cluster in different region
2. **Local MongoDB**: Install MongoDB locally for development
3. **Different Database**: Use PostgreSQL with Supabase or similar
4. **Keep Current System**: The temporary system works perfectly for development