import * as coc from 'clashofclans.js'
import { ObjectId } from 'mongodb'

export default class LastWar {
    constructor(public start: Date, public end: Date, public id?: ObjectId) { } 
}