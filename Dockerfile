# ใช้ Node.js base image ที่เบา
FROM node:alpine

# ตั้งค่า working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์โปรเจกต์ทั้งหมดลง container
COPY . .

# ติดตั้ง dependencies
RUN npm install


# Build แอปพลิเคชัน Next.js
RUN npm run build

# เปิดพอร์ตสำหรับ container
EXPOSE 3000

# คำสั่งเริ่มต้นเพื่อรัน Next.js ในโหมด production
CMD ["npm", "run", "dev"]