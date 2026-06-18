/*
  Warnings:

  - Added the required column `homeworkStatus` to the `HomeworkResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING', 'CHECKED');

-- AlterTable
ALTER TABLE "HomeworkAnswerStudent" ADD COLUMN     "homeworkStatus" "HomeworkStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "HomeworkResult" ADD COLUMN     "homeworkStatus" "HomeworkStatus" NOT NULL;
