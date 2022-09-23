import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  CreateUserDto,
  LoginUserDto,
} from '../src/auth/dto';
import {
  CreateContactDto,
  EditContactDto,
} from '../src/contact/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3001',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: CreateUserDto = {
      fullName: 'joao francisco',
      email: 'asada@asdaasd.com',
      cellphone: '123451',
      password: '1234',
    };

    const dtoLogin: LoginUserDto = {
      email: 'asada@asdaasd.com',
      password: '1234',
    };

    describe('Signup', () => {
      it('Should throw exception if empty email/password', () => {
        return pactum
          .spec()
          .post('/auth/signup/')
          .withBody({ fullName: dto.fullName })
          .expectStatus(400);
      });
      it('Should throw exception if empty body', () => {
        return pactum
          .spec()
          .post('/auth/signup/')
          .expectStatus(400);
      });
      it('Should sigup', () => {
        return pactum
          .spec()
          .post('/auth/signup/')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should not login, wrong password', () => {
        return pactum
          .spec()
          .post('/auth/signin/')
          .withBody({
            email: dtoLogin.email,
            password: 'senha errada',
          })
          .expectStatus(403);
      });
      it('should not login, empty request', () => {
        return pactum
          .spec()
          .post('/auth/signin/')
          .withBody({})
          .expectStatus(400)
          .expectBodyContains('message');
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/signin/')
          .withBody(dtoLogin)
          .expectStatus(200)
          .stores('userToken', 'token')
          .expectBodyContains('token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Should get current User', () => {
        return pactum
          .spec()
          .get('/user/')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      const dto: EditUserDto = {
        fullName: 'nome editado',
      };

      it('Should edit user', () => {
        return pactum
          .spec()
          .patch('/user/')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.fullName);
      });
    });
  });

  describe('Contact', () => {
    const dto: CreateContactDto = {
      fullName: 'nome contato',
      email: 'email@contato.com',
      cellphone: '+55545612314',
    };
    describe('Create Contact', () => {
      it('Should CREATE contact', () => {
        return pactum
          .spec()
          .post('/contact/')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('contactId', 'id');
      });
      it('Should NOT create contact, email invalid', () => {
        return pactum
          .spec()
          .post('/contact/')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({
            ...dto,
            email: 'email@contato',
          })
          .expectStatus(400);
      });
    });
    describe('Get Contact', () => {
      it('Should GET contacts of user', () => {
        return pactum
          .spec()
          .get('/contact/')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Contact by id', () => {
      it('Should GET contacts of user', () => {
        return pactum
          .spec()
          .get('/contact/$S{contactId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectBodyContains('ownerId');
      });
    });
    describe('Edit Contact by id', () => {
      const editDto: EditContactDto = {
        fullName: 'nome contato editado',
      };

      it('Should UPDATE contacts of user', () => {
        return pactum
          .spec()
          .patch('/contact/$S{contactId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(editDto)
          .expectStatus(200);
      });
    });
    describe('Delete Contact by id', () => {
      it('Should DELETE contacts of user', () => {
        console.log('$S{contactId}');

        return pactum
          .spec()
          .delete('/contact/$S{contactId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(204);
      });
    });
  });
});
