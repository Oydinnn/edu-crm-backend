/*
  Warnings:

  - You are about to drop the column `lesson_id` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_lesson_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "lesson_id";
