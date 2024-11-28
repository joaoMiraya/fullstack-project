import { FastifyInstance } from 'fastify';
import { DriverEntity, SafeDriver } from '../entities/driverEntity';

export class DriverRepository {
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

  async create(driver: DriverEntity): Promise<void> {
    const uid = driver.getUid();
    const car = driver.getCar();
    const cnh = driver.getCnh();
    const description = driver.getDescription();
    const fee = driver.getFee();
    const minKm = driver.getMinKm();

    try {
      await this.db.query(
        'INSERT INTO drivers (u_id, car, cnh, description, fee, min_km) VALUES (?, ?, ?, ?, ?, ?)',
        [uid, car, cnh, description, fee, minKm]
      );
    } catch (error: any) {
      throw new Error(`Error creating a driver: ${error.message}`);
    }
  }
  
  async findAll(): Promise<DriverEntity[]> {
    try {
      const [rows] = await this.db.query('SELECT * FROM drivers;');
      return rows;
    } catch (error: any) {
      throw new Error(`Error getting drivers: ${error.message}`);
    }
  }
  
  async findOne(email: string): Promise<DriverEntity | null> {
    try {
      const query = `SELECT d.u_id, d.car, d.cnh, d.description, d.fee, d.min_km, u.name
        FROM users u INNER JOIN drivers d ON d.u_id = u.uid
        WHERE u.email = ? LIMIT 1;`;
      const [rows]: any[] = await this.db.query(query, [email]);
      if (rows.length > 0) {
        const driver = rows[0];
        return new DriverEntity(driver.uid, driver.car, driver.cnh, driver.description, driver.minKm, driver.fee);
      }

      return null;
    } catch (error: any) {
      throw new Error(`Error fetching driver: ${error.message}`);
    }
  }

  async getDriver(uId: string): Promise<DriverEntity | null> {
    try {
      const query = `SELECT d.u_id, d.car, d.cnh, d.description, d.fee, d.min_km, u.name
        FROM users u INNER JOIN drivers d ON d.u_id = u.uid
        WHERE d.u_id = ? LIMIT 1;`;
      const [rows]: any[] = await this.db.query(query, [uId]);
      if (rows.length > 0) {
        const driver = rows[0];
        return driver;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Error fetching driver: ${error.message}`);
    }
  }


  async getDriverRatingAverage(uid: string): Promise<number | null> {
      try {
          const [rows]: any[] = await this.db.query(
              `
              SELECT AVG(r.stars) AS averageRating 
              FROM rating r 
              INNER JOIN drivers d ON d.u_id =  r.to_id 
              WHERE d.u_id = ?`,
              [uid]
          );
          return rows[0]?.averageRating || null;
      } catch (error: any) {
          throw new Error(`Error getting rating: ${error.message}`);
      }
  }

  async getDriverRating(uid: string): Promise<{ rating: number; comment: string }> {
      try {
          const [rows]: any[] = await this.db.query(
              `
              SELECT 
                  AVG(r.stars) AS averageRating,
                  GROUP_CONCAT(r.description SEPARATOR ', ') AS comments
              FROM rating r
              INNER JOIN drivers d ON r.to_id = d.id
              WHERE d.u_id = ?`,
              [uid]
          );
  
          const averageRating = rows[0]?.averageRating || 0;
          const comments = rows[0]?.comments || '';
  
          return { rating: averageRating, comment: comments };
      } catch (error: any) {
          throw new Error(`Error getting rating: ${error.message}`);
      }
  }

  async findDriversAvailable(km: number): Promise<SafeDriver[] | null> {
      try {
        const query = `SELECT d.u_id, d.car, d.cnh, d.description, d.fee, d.min_km, u.name
          FROM users u INNER JOIN drivers d ON d.u_id = u.uid
          WHERE d.min_km <= ?;`;
        const [rows]: any[] = await this.db.query(query, [km]);
        return rows;
      } catch (error: any) {
        throw new Error(`Error fetching drivers available: ${error.message}`);
      }
  }

  async getDriversWithReviews(km: number): Promise<SafeDriver[]> {
    try {
        const [rows]: any[] = await this.db.query(
            `
            SELECT 
                d.u_id, 
                d.car, 
                d.cnh, 
                d.description, 
                d.fee, 
                d.min_km, 
                u.name,
                r.stars AS rating,
                r.description AS comment
            FROM 
                users u
            INNER JOIN 
                drivers d ON d.u_id = u.uid
            LEFT JOIN 
                rating r ON r.to_id = d.u_id
            WHERE 
                d.min_km <= ?;`, 
            [km]
        );

        const drivers = rows.reduce((acc: SafeDriver[], row: any) => {
            const driver = acc.find((d) => d.uid === row.u_id);

            const feeInReais = row.fee / 100;
            const totalKm = km / 1000;
            const totalCost = feeInReais * totalKm;

            if (driver) {
                driver.review.push({
                    rating: row.rating,
                    comment: row.comment,
                });
            } else {
                acc.push({
                    uid: row.u_id,
                    name: row.name,
                    car: row.car,
                    description: row.description,
                    minKm: row.min_km,
                    value: totalCost,
                    review: row.rating ?
                      [
                      {
                        rating: row.rating,
                        comment: row.comment,
                      },
                    ] : [],
                });
            }
            return acc;
        }, []);

        return drivers;
    } catch (error: any) {
        throw new Error(`Error fetching drivers with reviews: ${error.message}`);
    }
  }

  async setRating(
    customerId: string,
    driverId: string,
    racingId: string,
    stars: number,
    comment: string
  ) {
    try {
      await this.db.query(
        'INSERT INTO rating (from_id, to_id, racing_id, stars, description) VALUES (?, ?, ?, ?, ?)',
        [customerId, driverId, racingId, stars, comment]
      );
    } catch (error: any) {
      throw new Error(`Error creating a driver: ${error.message}`);
    }
  }
}
