/*
  Warnings:

  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_teacher_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "teacher_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "capacity" DROP NOT NULL;

-- DropEnum
DROP TYPE "CourseLevel";

-- CreateTable
CREATE TABLE "GroupTeacher" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupTeacher_group_id_teacher_id_key" ON "GroupTeacher"("group_id", "teacher_id");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTeacher" ADD CONSTRAINT "GroupTeacher_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTeacher" ADD CONSTRAINT "GroupTeacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
