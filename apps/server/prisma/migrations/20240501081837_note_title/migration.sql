/*
  Warnings:

  - Made the column `title` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Note` MODIFY `title` VARCHAR(50) NOT NULL DEFAULT '未命名';
