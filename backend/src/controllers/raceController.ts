import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DriverRepository } from '../repositorys/driverRepository';
import { RaceRepository } from '../repositorys/raceRepository';
import { RaceEntity } from '../entities/raceEntity';
import { generateUid } from '../services/uidGenerator';

export class RaceController {
    private driverRepository: DriverRepository;
    private raceRepository: RaceRepository;
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.driverRepository = new DriverRepository(fastify);
        this.raceRepository = new RaceRepository(fastify);
        this.fastify = fastify;
    }

    async confirmRace(request: FastifyRequest, reply: FastifyReply) {
        const { driver, customer_id, car, origin, destination, distance, duration, value } = request.body as {
            customer_id: string;
            car: string;
            origin: string;
            destination: string;
            distance: number;
            duration: number;
            driver: string;
            value: number;
        };
        const rId = generateUid();
        if(driver === customer_id) {
            const data = {
                error_code: "INVALID_DATA",
                error_description: 'Um motorista não pode fazer viagem com ele mesmo'
            };
            return  reply.status(400).send(data);
        }
        try {
            const race = new RaceEntity(rId, driver, 'PENDING', car, customer_id, origin, destination, distance, duration, value);
            this.raceRepository.create(race)
            
            this.fastify.log.info('Create new race sucefully');

            reply.status(200).send({sucess: true, race: race});
        } catch(err) {
            const data = {
                error_code: "INVALID_DATA",
                error_description: err
            };
            reply.status(400).send(data);
        }
    }

    async cancelRace(request: FastifyRequest, reply: FastifyReply) {
        const { rId } = request.body as { rId: string };
        reply.status(200).send({sucess: true});
        try {
            await this.raceRepository.cancel(rId);
        } catch(err) {
            reply.status(400).send(err);
        }
    }

    async doneRace(request: FastifyRequest, reply: FastifyReply) {
        const { rId } = request.body as { rId: string };
        reply.status(200).send({sucess: true});
        try {
            await this.raceRepository.done(rId);
        } catch(err) {
            reply.status(400).send(err);
        }
    }

    async getDriverRatingAverage(request: FastifyRequest, reply: FastifyReply) {
        const { uid } = request.params as {uid: string};
        try {
            const averageRating = await this.driverRepository.getDriverRatingAverage(uid);
            reply.status(200).send(averageRating);
        } catch(err: any) {
            reply.status(400).send(err)
        }
    }

    async getHistoryRace(request: FastifyRequest, reply: FastifyReply) {
        const { customer_id, driver_id } = request.params as { customer_id: string, driver_id?: string };
        try {
            const history = await this.raceRepository.history(customer_id, driver_id);
            reply.status(200).send(history);
        } catch(err){
            reply.status(400).send(err);
        }
    }

    async getAddressFromCordinates(request: FastifyRequest, reply: FastifyReply) {
        const { lat, lng } = request.params as { lat: number, lng: number };
        try {
            const address = await this.raceRepository.getAddressFromCoordinates(lat, lng);
            reply.status(200).send(address);
        } catch(err) {
            reply.status(400).send(err);
        }
    }

    async setRating(request: FastifyRequest, reply: FastifyReply) {
        const { customerId, driverId, racingId, stars, comment } = request.body as {
                customerId: string,
                driverId: string,
                racingId: string,
                stars: number,
                comment: string
            };
        try {
            await this.driverRepository.setRating(customerId,driverId,racingId,stars,comment);
            reply.status(200);
        } catch(err) {
            reply.status(400).send(err);
        }
    }

    async getDriver(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { uid } = request.params as { uid: string };
        try {
            const driver = await this.driverRepository.getDriver(uid);
            reply.status(200).send(driver);
        } catch (error: any) {
            reply.status(500).send({ message: error.message });
        }
    }
}
