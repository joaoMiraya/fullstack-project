import { FastifyInstance } from "fastify";
import { RaceEntity } from "../entities/raceEntity";


  export async function setRaceOnCache(fastify: FastifyInstance, race: RaceEntity, passengerId: string) {
    const { redis } = fastify;
    try {
      await redis.incr('racesCounter');
      const counter = await redis.get('racesCounter');
      await redis.set(`races:${counter + '-' + passengerId}`, JSON.stringify(race));
      fastify.log.warn(`Race-${passengerId} added on Redis`);
    } catch(err: any) {
      fastify.log.error(`Error adding Race-${passengerId}: ${err.message}`);
      throw err;
    }
  }

  export async function getRacesOnCache(fastify: FastifyInstance, uid: string) {
    const { redis } = fastify;
    let cursor = '0';
    const races: any[] = [];
  
    try {
      do {
        const [newCursor, keys] = await redis.scan(cursor, 'MATCH', `races:*-${uid}`, 'COUNT', 100);
        cursor = newCursor;
  
        if (keys.length > 0) {
          const values = await redis.mget(...keys);
          races.push(...values.map(value => JSON.parse(value!)));
        }
      } while (cursor !== '0');
  
      fastify.log.info(`Retrieved ${races.length} races from cache.`);
      return races;
  
    } catch (err: any) {
      fastify.log.error(`Error retrieving races from cache: ${err.message}`);
      throw err;
    }
  }
  