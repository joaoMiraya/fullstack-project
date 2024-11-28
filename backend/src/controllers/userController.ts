import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserRepository } from '../repositorys/userRepository';
import { SafeUser, UserEntity } from '../entities/userEntity';
import { generateUid } from '../services/uidGenerator';
import { DriverEntity, SafeDriver } from '../entities/driverEntity';
import { DriverRepository } from '../repositorys/driverRepository';

export class UserController {
  private fastify: FastifyInstance;
  private userRepository: UserRepository;
  private driverRepository: DriverRepository;

  constructor(fastify: FastifyInstance) {
    this.driverRepository = new DriverRepository(fastify);
    this.userRepository = new UserRepository(fastify);
    this.fastify = fastify;
  }

  async createUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name, email, password, driver } = request.body as {
      name: string;
      email: string;
      password: string;
      driver?: {
        cnh: string;
        car: string;
        minKm: number;
        fee: number;
        description: string;
      };
    };

    if (!name || !email || !password) {
      reply.status(400).send({ message: 'Missing required fields' });
      return;
    }
    const alreadyExists = await this.userRepository.findOne(email);
    if(alreadyExists) {
      this.fastify.log.error("Email duplicated")
     return reply.status(203).send({ message: 'Email já cadastrado'});
    }
    try {
      const uid = generateUid();
      const hashedPassword = await this.fastify.bcrypt.hash(password);
      const user = new UserEntity(uid, name, email, hashedPassword);
      await this.userRepository.create(user);
      this.fastify.log.info("User Created");
      
      const token = this.fastify.jwt.sign({ uid: user.getUid(), name: user.getName(), email: user.getEmail()}, {expiresIn: '7d'})
      
      if(driver) {
        const { cnh, car, minKm, fee, description } = driver;
        const newDriver = new DriverEntity(uid, car, cnh, description, minKm, fee);
        await this.driverRepository.create(newDriver);
        this.fastify.log.info("Driver Created");

        const review = await this.driverRepository.getDriverRating(user.getUid());

        const safeDriver: SafeDriver = {
          uid: user.getUid(),
          name: user.getName(),
          car: newDriver.getCar(),
          minKm: newDriver.getMinKm(),
          value: newDriver.getFee(),
          description: newDriver.getDescription(),
          review: review.rating && review.comment
          ? [
                {
                    rating: review.rating,
                    comment: review.comment,
                },
            ]
          : [],
        };
        
        return reply.status(201).send({ token, user: safeDriver });
      }

      const safeUser: SafeUser = {uid: user.getUid(), name: user.getName(), email: user.getEmail()};
      return reply.status(201).send({ token, user: safeUser });
    } catch (error: any) {
      reply.status(500).send({ message: error.message });
    }
  }

  async authUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { email, password } = request.body as {email: string; password: string };
    if (!email || !password) {
      reply.status(400).send({ message: 'Missing required fields' });
      return;
    }
    try {

      const user = await this.userRepository.findOne(email);
      if(!user){
        return reply.status(400).send({ message: 'Email não existe'});
      }
   
      const validPasswd = await this.fastify.bcrypt.compare(password, user.getPassword());
      if(!validPasswd){
        return reply.status(400).send({ message: 'Senha inválida'});
      }
      const token = this.fastify.jwt.sign({ uid: user.getUid(), name: user.getName(), email: user.getEmail()}, {expiresIn: '7d'})
      const driver = await this.driverRepository.findOne(email);

      if(driver) {
         const review = await this.driverRepository.getDriverRating(user.getUid());

         const safeDriver: SafeDriver = {
          uid: user.getUid(),
          name: user.getName(),
          car: driver.getCar(),
          minKm: driver.getMinKm(),
          value: driver.getFee(),
          description: driver.getDescription(),
          review: review.rating && review.comment
          ? [
                {
                    rating: review.rating,
                    comment: review.comment,
                },
            ]
          : [],
          createdAt: user.getCreatedAt()
        };
        
         return reply.status(200).send({ token: token, user: safeDriver });
      }
      
      const safeUser: SafeUser = {
        uid: user.getUid(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt()
      };
      reply.status(200).send({ token: token, user: safeUser });
    } catch (error: any) {
      reply.status(500).send({ message: error.message });
    }
  }

  async getUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const users = await this.userRepository.findAll();
      reply.status(200).send(users);
    } catch (error: any) {
      reply.status(500).send({ message: error.message });
    }
  }

  async getUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { uid } = request.params as { uid: string };
    try {
      const users = await this.userRepository.getUserIdByUid(uid);
      reply.status(200).send(users);
    } catch (error: any) {
      reply.status(500).send({ message: error.message });
    }
  }
}
