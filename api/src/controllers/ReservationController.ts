import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { Reservation } from '../models/Reservation'
import validatePost from './RequestValidators'

interface CreateRezRequest extends Request {
  reservation?: Reservation
}

const validateCreateRequest = (req: CreateRezRequest, res: Response, next) => {
  let rez: Reservation
  try {
    rez = new Reservation(req.body)
  } catch (err) {
    console.error({ message: "invalid request", request_type: "create_reservation", request_body: req.body, err: err })
    return res.status(400).json({ message: `Invalid request body` });
  }
  req.reservation = rez
  next();
}

@Controller('api/reservations')
export class ReservationController {
  @Get('')
  private async getAll(req: Request, res: Response) {
    let reservations = await Reservation.getAllReservations();
    return res.json(reservations).status(200)
  }

  @Post('')
  @Middleware(validatePost)
  @Middleware(validateCreateRequest)
  private async create(req: CreateRezRequest, res: Response) {
    let rez: Reservation = req.reservation
    try {
      rez.save();
    } catch (err) {
      console.error({ message: "invalid request", request_type: "create_reservation", request_body: req.body, err: err })
      return res.status(400).json({ message: `invalid request body` });
    }
    return res.json(rez.toJSON()).status(201)
  }

  @Get(':reservationId')
  private async getOne(req: Request, res: Response) {
    let rezId = req.params.reservationId
    let reservation = await Reservation.getReservation(rezId);
    if (reservation) {
      return res.json(reservation).status(200)
    } else {
      return res.status(404).json({ message: `${rezId} not found` });
    }
  }
}
