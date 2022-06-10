const request = require('supertest')
const app = require('../../app/index')
require('dotenv').config()

describe('test handleGetCar', () => {
    it('return 200 OK', async () => {
        return request(app)
            .get('/v1/cars/1')
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res.statusCode).toBe(200)
            })
    })
    it('return 404 using invalid id', () => {
        request(app)
            .get('/v1/cars/1000')
            .expect(404)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })
})

describe('test handleCreateCar', () => {
    it('return 201 OK', async () => {
        const accessToken = await request(app).post('/v1/auth/login').send({
            email: 'tsania@gmail.com',
            password: 'tsania',
        })

        const name = 'Mazda RX4'
        const price = 300000
        const size = 'SMALL'
        const image = 'https://source.unsplash.com/500x500'

        return request(app)
            .post('/v1/cars')
            .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
            .set('Content-Type', 'application/json')
            .send({ name, price, size, image, isCurrentlyRented: false })
            .then((res) => {
                expect(res.statusCode).toBe(201)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        ...res.body,
                        name,
                        price,
                        size,
                        image,
                        isCurrentlyRented: false,
                    })
                )
            })
    })

    it('return 401 unauthorized access', async () => {
        const loginAuth = {
            email: 'salsabila@gmail.com',
            password: '123',
        }

        const response = await request(app)
            .post('/v1/auth/login')
            .send(loginAuth)

        const token = `Bearer ${response.body.accessToken}`

        const carPayload = {
            name: 'Honda',
            price: 1000,
            size: 'small',
        }

        await request(app)
            .post('/v1/cars')
            .set('Authorization', token)
            .send(carPayload)
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })
})

describe('test handleListCar', () => {
    it('should response with 200 as status code', async () => {
        return request(app)
            .get('/v1/cars')
            .then((res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        cars: expect.arrayContaining([expect.any(Object)]),
                        meta: expect.objectContaining({
                            pagination: expect.any(Object),
                        }),
                    })
                )
            })
    })
})
