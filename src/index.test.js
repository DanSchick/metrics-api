import app from './index';
import supertest from 'supertest';


describe('API', () => {
    describe('When it recieves an empty post', () => {
        it('replies with a 200 code', async () => {
            await supertest(app).post('/metric/randomkey123').expect(200);
        });
    });
});