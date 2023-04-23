import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { version as uuidVersion } from 'uuid'
import { validate as uuidValidate } from 'uuid'

import { Inventory, Reservation } from '../models'

interface RezRequest extends Request {
  reqDate?: number
  inventory?: Inventory
}

const validate_post = (req: Request, res: Response, next) => {
  if (req.header('Content-Type') != 'application/json') {
    return res.status(400).json({ message: `Invalid content-type: ${req.header('Content-Type')}` })
  }
  if (typeof req.body !== 'object') {
    return res.status(400).json({ message: 'Request body must be an object' })
  }
  next()
}

const hasDateInventory = async (req: RezRequest, res: Response, next) => {
  let reqDate = Date.parse(req.params.date)
  if (isNaN(reqDate) || !reqDate) {
    return res.status(400).json({ message: `invalid date: ${req.params.date}` })
  }
  req.reqDate = reqDate
  next()
}

@Controller('api/inventory')
export class InventoryController {
  @Get('')
  private async getAll(req: Request, res: Response) {
    let reservations = await Inventory.findAll()
    return res.json(reservations).status(200)
  }

  @Post('')
  @Middleware(validate_post)
  private async create(req: Request, res: Response) {
    let entry: Inventory
    try {
      entry = new Inventory(req.body)
      entry.save()
    } catch (err) {
      return res.status(400).json({ message: `Invalid request: ${err})` })
    }
    return res.json(entry.toJSON()).status(201)
  }

  @Get(':id')
  private async getInventory(req: Request, res: Response) {
    let entry: Inventory
    let invId = req.params.id
    if (!uuidValidate(invId) || !(uuidVersion(invId) === 4)) {
      return res.status(400).json({ message: `id is not a valid uuid: ${invId}` })
    }
    entry = await Inventory.findByPk(req.params.id)
    if (entry) {
      return res.json(entry.toJSON()).status(200)
    } else {
      return res.status(404).json({ message: `${invId} not found` })
    }
  }

  @Get('dates/:date')
  @Middleware(hasDateInventory)
  private async getInventoryforDay(req: RezRequest, res: Response) {
    let entry = req.inventory
    if (entry.days[new Date(req.reqDate).getDay()]) {
      return res.json(entry.toJSON()).status(200)
    } else {
      return res.status(404).json({ message: `No Inventory for ${req.reqDate}` })
    }
  }

  @Get('dates/:date/slots/:hour')
  @Middleware(hasDateInventory)
  private async getInventorySlotsforHour(req: RezRequest, res: Response) {
    let reqDate = new Date(req.reqDate)
    let reqHour = parseInt(req.params.hour)
    let rezSlot = new Date(reqDate)
    rezSlot.setHours(reqHour)
    console.log(`reqHour value: "${reqHour}"`)
    console.log(`reqDate value: "${reqDate}"`)
    console.log(`rezSlot value: "${rezSlot}"`)
    return res.status(200).json({ slots: await Inventory.getAvailableSlotsForHour(rezSlot) })
  }
}
