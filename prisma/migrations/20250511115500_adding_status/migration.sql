-- CreateEnum
CREATE TYPE "BookingStaus" AS ENUM ('WAITING', 'CONFIMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "BookSeats" ADD COLUMN     "status" "BookingStaus" NOT NULL DEFAULT 'CONFIMED';
