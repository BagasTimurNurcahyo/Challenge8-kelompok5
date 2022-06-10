const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthenticationController = require('../AuthenticationController');
const {
    JWT_SIGNATURE_KEY,
} = require('../../../config/application');
const {
    User,
} = require('../../models');

describe('#createTokenFromUser', () => {
    it('it should create new token', async () => {
        const mockUser = {
            id: 1,
            name: 'luthfi',
            email: 'luthfi@gmail.com',
            image: 'luthfi.jpg',
        };

        const mockRole = {
            id: 1,
            name: 'ADMIN',
        };

        const token = jsonwebtoken.sign({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            image: mockUser.image,
            role: {
                id: mockRole.id,
                name: mockRole.name,
            },
        }, JWT_SIGNATURE_KEY);

        const app = new AuthenticationController({
            jwt: jsonwebtoken,
        });
        const result = await app.createTokenFromUser(mockUser, mockRole);
        const hasil = jest.fn();
        hasil.mockReturnValue(result);

        expect(result).toEqual(token);
    });
});

describe('#decodeToken', () => {
    it('should decode token', async () => {
        const mockUser = {
            id: 1,
            name: 'luthfi',
            email: 'luthfi@gmail.com',
            image: 'luthfi.jpg',
        };

        const mockRole = {
            id: 1,
            name: 'ADMIN',
        };

        const token = jsonwebtoken.sign({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            image: mockUser.image,
            role: {
                id: mockRole.id,
                name: mockRole.name,
            },
        }, JWT_SIGNATURE_KEY);

        const decoded = jsonwebtoken.verify(token, JWT_SIGNATURE_KEY);
        const app = new AuthenticationController({
            jwt: jsonwebtoken,
        });
        const result = await app.decodeToken(token);

        expect(result).toEqual(decoded);
    });
});

describe('#encryptPassword', () => {
    it('should encrypt the password', async () => {
        const password = 'luthfi12345';
        const encrypt = bcrypt.hashSync(password, 10);

        const app = new AuthenticationController({
            jwt: jsonwebtoken,
            bcrypt,
        });
        const result = await app.encryptPassword(password);

        expect(result.slice(0, -53)).toEqual(encrypt.slice(0, -53));
    });
});

describe('#verifyPassword', () => {
    it('should verify password and encrypted one', async () => {
        const password = 'luthfi12345';

        const encrypt = bcrypt.hashSync(password, 10);

        const verif = bcrypt.compareSync(password, encrypt);

        const app = new AuthenticationController({
            jwt: jsonwebtoken,
            bcrypt,
        });
        const result = await app.verifyPassword(password, encrypt);

        expect(result).toEqual(verif);
    });
});

describe('#handleRegister', () => {
    it('should register user', async () => {
        const payloadUser = {
            name: 'luthfi',
            email: 'luthfi@gmail.com',
            password: 'luthfi12345',
        };

        const mockRequest = {
            body: {
                payloadUser,
            },
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        const mockNext = {};

        const mockUser = new User({
            payloadUser,
        });
        const mockUserModel = {};

        mockUserModel.findOne = jest.fn().mockReturnValue(mockUser);

        const app = new AuthenticationController({
            userModel: mockUserModel,
        });

        await app.handleRegister(mockRequest, mockResponse, mockNext);
    });
});
