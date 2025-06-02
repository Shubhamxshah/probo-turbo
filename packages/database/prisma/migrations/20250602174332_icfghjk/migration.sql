/*
  Warnings:

  - You are about to drop the column `available` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `locked` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `no_available` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_locked` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yes_available` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yes_locked` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "available",
DROP COLUMN "locked",
ADD COLUMN     "no_available" INTEGER NOT NULL,
ADD COLUMN     "no_locked" INTEGER NOT NULL,
ADD COLUMN     "yes_available" INTEGER NOT NULL,
ADD COLUMN     "yes_locked" INTEGER NOT NULL;
