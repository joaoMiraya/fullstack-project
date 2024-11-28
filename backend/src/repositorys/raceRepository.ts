import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { RaceEntity } from '../entities/raceEntity';

export class RaceRepository {
  private db: any;

  constructor(fastify: FastifyInstance) {
    fastify.ready((err) => {
      if (err) {
        throw new Error('Error during Fastify initialization: ' + err.message);
      }
      this.db = fastify.database;
      if (!this.db) {
        throw new Error('Database connection is not available.');
      }
    });
  }

    async create(race: RaceEntity): Promise<void> {
        const driverId = race.getDriverUid();
        const rId = race.getRid();
        const status = race.getStatus();
        const passengerId = race.getPassengerUid();
        const origin = race.getOrigin();
        const destination = race.getDestination();
        const distance = race.getDistance();
        const duration = race.getDuration();
        const value = race.getValue();
        const car = race.getCar();

        try {
            await this.db.query(
                'INSERT INTO racing (r_id, driver_id, passenger_id, origin, destination, status, distance, duration, value, car) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [rId, driverId, passengerId, origin, destination, status, distance, duration, value, car]
            );
        } catch (error: any) {
            throw new Error(`Error creating a racing: ${error.message}`);
        }
    }
    
    async cancel(rId: string): Promise<void> {
        try {
            await this.db.query(
                "UPDATE racing SET status = 'CANCELED' WHERE r_id = ?",
                [rId]
            );
        } catch (error: any) {
            throw new Error(`Error creating a racing: ${error.message}`);
        }
    };

    async done(rId: string): Promise<void> {
        try {
            await this.db.query(
                "UPDATE racing SET status = 'DONE' WHERE r_id = ?",
                [rId]
            );
        } catch (error: any) {
            throw new Error(`Error creating a racing: ${error.message}`);
        }
    };

    async history(customer_id: string, driver_id?: string): Promise<RaceEntity[]> {
        let where = '';
        let params: (string | undefined)[] = [customer_id];
    
        if(driver_id) {
            where = `AND r.driver_id = ?`;
            params.push(driver_id);
        }
    
        try {
            const [rows] = await this.db.query(
                `SELECT r.*,
                    (SELECT u.name FROM users u WHERE u.uid = r.driver_id) as driver,
                    (SELECT rt.stars FROM rating rt WHERE rt.racing_id = r.r_id) as rating
                 FROM racing r 
                 INNER JOIN drivers d ON d.u_id = r.driver_id 
                 WHERE r.passenger_id = ? ${where} 
                 ORDER BY r.created_at DESC;`, 
                 params
            );
            return rows;
        } catch (error: any) {
            throw new Error(`Error getting drivers: ${error.message}`);
        }
    }
    

    async getCoordinates(placeId: string) {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GOOGLE_API_KEY}`
        );

        if (response.data.status === "OK" && response.data.results.length > 0) {
            return response.data.results[0].geometry.location; 
        }

        throw new Error("Geocoding API não retornou coordenadas válidas.");
    }

    async getAddressFromCoordinates(lat: number, lng: number) {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`
        );
    
        if (response.data.status === "OK" && response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        }
    
        throw new Error("Geocoding API não retornou um endereço válido.");
    }
    
}
