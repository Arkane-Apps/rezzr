import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { Reservation, RESERVATIONS_FULL_ERROR } from '../models/Reservation'
import validatePost from './RequestValidators'
import { ValidationError } from 'sequelize'

interface CreateRezRequest extends Request {
  reservation?: Reservation
}

const validateCreateRequest = (req: CreateRezRequest, res: Response, next) => {
  let rez: Reservation
  try {
    rez = new Reservation(req.body)
  } catch (err) {
    console.error({
      message: 'invalid request',
      request_type: 'create_reservation',
      request_body: req.body,
      err: err,
    })
    return res.status(400).json({ message: `Invalid request body` })
  }
  req.reservation = rez
  next()
}

@Controller('api/reservations')
export class ReservationController {
  @Get('')
  private async getAll(req: Request, res: Response) {
    let reservations = await Reservation.getAllReservations()
    return res.json(reservations).status(200)
  }

  @Post('')
  @Middleware(validatePost)
  @Middleware(validateCreateRequest)
  private async create(req: CreateRezRequest, res: Response) {
    let rez: Reservation = req.reservation
    try {
      await rez.save()
    } catch (err) {
      let message = 'invalid request body'
      console.log('*****************')
      console.log(err.errors[0])
      console.log('*****************')
      if (
        err instanceof ValidationError &&
        err.errors.length == 1 &&
        err.errors[0].message == RESERVATIONS_FULL_ERROR
      ) {
        message = 'no reservations available for the specified timeslot'
      }
      console.error({
        message: 'unable to create reservation',
        request_type: 'create_reservation',
        request_body: req.body,
        err: err,
      })
      return res.status(400).json({ message: message })
    }
    return res.json(rez.toJSON()).status(201)
  }

  @Get(':reservationId')
  private async getOne(req: Request, res: Response) {
    let rezId = req.params.reservationId
    let reservation = await Reservation.getReservation(rezId)
    if (reservation) {
      return res.json(reservation).status(200)
    } else {
      return res.status(404).json({ message: `${rezId} not found` })
    }
  }

  @Get('times/:reservationTime')
  private async getReservationsAtTime(req: Request, res: Response) {
    let resultMap = { reservations: [] }
    let rezTime = new Date(Date.parse(req.params.reservationTime))
    let reservations = await Reservation.getReservationsAtTime(rezTime)
    if (reservations) {
      resultMap.reservations = reservations
    }
    return res.status(200).json(resultMap)
  }
}
