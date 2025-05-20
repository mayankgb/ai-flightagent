/*
  Warnings:

  - The values [CONFIMED] on the enum `BookingStaus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStaus_new" AS ENUM ('WAITING', 'CONFIRMED', 'CANCELLED');
ALTER TABLE "BookSeats" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BookSeats" ALTER COLUMN "status" TYPE "BookingStaus_new" USING ("status"::text::"BookingStaus_new");
ALTER TYPE "BookingStaus" RENAME TO "BookingStaus_old";
ALTER TYPE "BookingStaus_new" RENAME TO "BookingStaus";
DROP TYPE "BookingStaus_old";
ALTER TABLE "BookSeats" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';
COMMIT;

-- AlterTable
ALTER TABLE "BookSeats" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';
