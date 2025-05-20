/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `BookSeats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookSeats" DROP COLUMN "availableSeats";

-- AlterTable
ALTER TABLE "Flights" ADD COLUMN     "availableSeats" INTEGER NOT NULL DEFAULT 10;
