/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_teacher_id_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "teacher_id";
