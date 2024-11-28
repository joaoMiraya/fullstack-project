import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import axios from 'axios';
import { DriverRepository } from '../repositorys/driverRepository';
import { RaceRepository } from '../repositorys/raceRepository';

export class RoutesController {
    private driverRepository: DriverRepository;
    private raceRepository: RaceRepository;
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.driverRepository = new DriverRepository(fastify);
        this.raceRepository = new RaceRepository(fastify);
        this.fastify = fastify;
    }

    async calculateRoute(request: FastifyRequest, reply: FastifyReply) {
        const { customer_id, origin, destination } = request.body as {
            customer_id: string;
            origin: string;
            destination: string;
          };

        try {
            const body = {
                origin: {
                address: origin
                },
                destination: {
                address: destination
                },
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_AWARE',
                computeAlternativeRoutes: false,
                routeModifiers: {
                    avoidTolls: false,
                    avoidHighways: false,
                    avoidFerries: false,
                },
                languageCode: 'pt-BR',
                units: 'IMPERIAL',
            };
            const response = await axios.post(
                'https://routes.googleapis.com/directions/v2:computeRoutes',
                body,
                {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
                    'X-Goog-FieldMask': 'geocodingResults,routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
                },
            });
            const originPlaceId = response.data.geocodingResults.origin.placeId;
            const destinationPlaceId = response.data.geocodingResults.destination.placeId;
            const distance = response.data.routes[0].distanceMeters;
            const originCoordinates = await this.raceRepository.getCoordinates(originPlaceId);
            const destinationCoordinates = await  this.raceRepository.getCoordinates(destinationPlaceId);
            const drivers = await this.driverRepository.getDriversWithReviews(distance);
            
            this.fastify.log.info('Req Route API sucefully');

            const data = {
                customer_id: customer_id,
                distance: response.data.routes[0].distanceMeters,
                duration: response.data.routes[0].duration,
                origin: originCoordinates,
                destination: destinationCoordinates,
                options: {
                    ...drivers
                },
                routeResponse: response.data,
            }
            reply.status(200).send(data);
        } catch (error) {
            const data = {
                error_code: "INVALID_DATA",
                error_description: error
            };
            reply.status(400).send(data);
        }
    }
}
