import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

import { Reservation } from '../models/Reservation'

@Controller('api/reservations')
export class ReservationController {
  @Get('')
  private async get(req: Request, res: Response) {
    let reservations = await Reservation.findAll();
    return res.json(reservations).status(200)
  }
}
