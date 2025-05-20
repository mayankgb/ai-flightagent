-- CreateEnum
CREATE TYPE "State" AS ENUM ('AJMER', 'GWALIOR', 'DELHI', 'CHANDIGARH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flights" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "from" "State" NOT NULL,
    "to" "State" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookSeats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "availableSeats" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "BookSeats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookSeats_userId_flightId_key" ON "BookSeats"("userId", "flightId");

-- AddForeignKey
ALTER TABLE "BookSeats" ADD CONSTRAINT "BookSeats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSeats" ADD CONSTRAINT "BookSeats_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
