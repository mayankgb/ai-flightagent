import { $Enums, BookingStaus, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()
const state = $Enums.State


export async function getFlightDetails({ from, to }: { from: string, to: string }) {


    try {

        const data = await prisma.flights.findMany({
            where: {
                from: from as $Enums.State,
                to: to as $Enums.State
            }
        })
        // console.log(data)
        return {
            data: data
        }

    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }

}

export async function isFlightPresent({ flightId }: { flightId: string }) {
    try {

        const data = await prisma.flights.findFirst({
            where: {
                id: flightId
            },
            select: {
                id: true,
                from: true,
                to: true,
                time: true
            }
        })

    } catch (e) {
        console.log(e)
    }
}


export async function bookFlights({ flightId, userId }: { flightId: string, userId: string }) {
    try {

        const booking = await prisma.$transaction(async (tx) => {
            const userLocked = await tx.$queryRawUnsafe(
                `SELECT * FROM "User" WHERE id = $1 FOR UPDATE`,
                userId
            );

            const price = await tx.flights.update({
                where: {
                    id: flightId
                },
                data: {
                    availableSeats: { decrement: 1 }
                },
                select: {
                    price: true
                }
            })
            const bookingId = await tx.bookSeats.create({
                data: {
                    userId: userId,
                    flightId: flightId
                },
                select: {
                    id: true
                }
            })

            const updateUserBalance = await tx.user.update({
                where: {
                    id: userId
                },
                data: {
                    inrBalance: { decrement: price.price }
                }
            })
            return {
                bookingId: bookingId.id
            }

        })

        return {
            message: "successfully booked",
            bookingId: booking.bookingId,
            status: 200
        }


    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}

export async function getUserConfirmedBookings({ userId }: { userId: string }) {
    try {
        console.log(userId)

        const userBooking = await prisma.bookSeats.findMany({
            where: {
                userId: userId,
                status: "CONFIRMED"
            },
            select: {
                id: true,
                flights: {
                    select: {
                        id: true,
                        name: true,
                        from: true,
                        to: true,
                        time: true,

                    }
                }
            }
        })

        return {
            data: userBooking,
            message: "request compeleted",
            status: 200
        }

    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}

export async function cancelBooking({ bookingId, userId }: { bookingId: string, userId: string }) {
    console.log(bookingId)
    try {

        const existingBooking = await prisma.bookSeats.findFirst({
            where: {
                id: bookingId,
                status: "CANCELLED"
            },
            select: {
                id: true
            }
        })
        if (existingBooking?.id) {
            return {
                message: "user already cancelled this booking",
                status: 400
            }
        }
        

        const upadtedBalance = await prisma.$transaction(async (tx) => {
            const priceOfFlight = await tx.bookSeats.findFirst({
                where: {
                    id: bookingId,
                    status: "CONFIRMED"
                },
                select: {
                    flights: {
                        select: {
                            price: true
                        }
                    }
                }
            })
            console.log(priceOfFlight)
            const updateUser = await tx.user.update({
                where: {
                    id: userId
                },
                data: {
                    inrBalance: { increment: priceOfFlight?.flights.price }
                },
                select: {
                    inrBalance: true
                }
            })

            const cancelFlight = await tx.bookSeats.update({
                where: {
                    id: bookingId,
                    userId: userId
                },
                data: {
                    status: "CANCELLED"
                }
            })

            return updateUser.inrBalance
        })

        return {
            message: "ticket successfully canceled",
            status: 200,
            bookingId: bookingId,
            upadtedBalance: upadtedBalance
        }
    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}

export async function getUserDetails({ userId }: { userId: string }) {
    try {

        const userData = await prisma.user.findFirst({
            where: {
                id: userId,

            },
            select: {
                name: true,
                _count: { select: { BookSeats: true } },
                inrBalance: true
            },

        })

        return {
            message: "user details successfully fetched",
            status: 200,
            data: userData
        }

    } catch (e) {
        console.log(e)
        return {
            messsage: "something went wrong",
            status: 500
        }
    }
}