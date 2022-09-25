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
      email: 'email@contato.com',
      cellphone: '123451',
      password: '1234',
    };
    const dto2: CreateUserDto = {
      fullName: 'joao francisco',
      email: 'random@asdaasd.com',
      cellphone: '1234511',
      password: '12345',
    };

    const dtoLogin: LoginUserDto = {
      email: 'email@contato.com',
      password: '1234',
    };
    const dto2Login: LoginUserDto = {
      email: 'random@asdaasd.com',
      password: '12345',
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
      it('Should throw error, user already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup/')
          .withBody(dto)
          .expectStatus(403);
      });
      it('Should sigup', () => {
        return pactum
          .spec()
          .post('/auth/signup/')
          .withBody(dto2)
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
          .stores('userToken1', 'token')
          .stores('userId1', 'userId')
          .expectBodyContains('token')
          .expectBodyContains('userId');
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/signin/')
          .withBody(dto2Login)
          .expectStatus(200)
          .stores('userToken2', 'token')
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
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      const dto: EditUserDto = {
        fullName: 'nome editado',
      };

      it('Should EDIT user', () => {
        return pactum
          .spec()
          .patch('/user/$S{userId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('fullName');
      });
      it('Should NOT EDIT profile from other user', () => {
        return pactum
          .spec()
          .patch('/user/$S{userId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .withBody(dto)
          .expectStatus(403);
      });
      it('Should NOT EDIT profile not found', () => {
        return pactum
          .spec()
          .patch('/user/1235123')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .withBody(dto)
          .expectStatus(404);
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
            Authorization:
              'Bearer $S{userToken1}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('contactId1', 'id');
      });
      it('Should NOT create contact, email invalid', () => {
        return pactum
          .spec()
          .post('/contact/')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
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
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Contact by id', () => {
      it('Should GET contacts of user', () => {
        return pactum
          .spec()
          .get('/contact/$S{contactId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
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
          .patch('/contact/$S{contactId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .withBody(editDto)
          .expectStatus(200);
      });
      it('Should NOT UPDATE contacts from other user', () => {
        return pactum
          .spec()
          .patch('/contact/$S{contactId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .withBody(editDto)
          .expectStatus(403);
      });
    });
    it('Should NOT DELETE contacts from other user', () => {
      return pactum
        .spec()
        .delete('/contact/$S{contactId1}')
        .withHeaders({
          Authorization: 'Bearer $S{userToken2}',
        })
        .expectStatus(403)
        .inspect();
    });
    describe('DELETE Contact by id', () => {
      it('Should DELETE contacts of user', () => {
        return pactum
          .spec()
          .delete('/contact/$S{contactId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(204);
      });
      it('Should NOT DELETE contacts that dont exists, or alreadt deleted', () => {
        return pactum
          .spec()
          .delete('/contact/$S{contactId1}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(404);
      });
    });
  });
});
