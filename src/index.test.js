import app, { isOverAnHourAgo } from './index';
import supertest from 'supertest';


describe('API', () => {
    describe('When it receives a post with no value', () => {
        it('replies with a 400 code', async () => {
            const res = await supertest(app).post('/metric/randomkey123').expect(200);
            expect(res.body).toEqual({});
        });
    })
    describe('When it receives a get that has no data', () => {
        it('responds with a 400', async () => {
            const res = await supertest(app).get('/metric/foobar/sum').expect(400);
            expect(res.body).toEqual({});
        })

    })
    describe('When it recieves a valid post, and then a valid get request', () => {
        it('sends back the correct metric sum', async () => {
            const json = {
                value: 30
            };

            await supertest(app).post('/metric/randomkey123')
            .send(json)
            .set('Content-Type', 'application/json')
            .expect(200);

            const response = await supertest(app).get('/metric/randomkey123/sum').expect(200);
            expect(response.text).toEqual(JSON.stringify(json));

        });
    });
    describe('isOverAnHourAgo', () => {
        it('returns true if the date is over an hour ago', () => {
            const date = new Date();
            date.setHours(date.getHours() - 2);
            expect(isOverAnHourAgo(date)).toBe(true);
        })
        it('returns false if the date is less than an hour ago', () => {
            const date = new Date();
            date.setHours(date.getHours() - 1);
            expect(isOverAnHourAgo(date)).toBe(false);
        })
    })
});