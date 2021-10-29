import express from 'express';
import { isOverAnHourAgo } from './utils';

const server = express();
server.use(express.json());

const port = process.env.PORT || 3000;
const data = {}


server.get('/metric/:key/sum', (req, res) => {
    const key = req.params.key
    if(!data[key] || !data[key].values){
        res.send('{}');
        return;
    }
    const values = data[key].values;
    console.log(values);
    const filtered = values.filter(v => !isOverAnHourAgo(v.time));

    let sum = 0;
    filtered.forEach(obj => {
        console.log(obj)
        const {value} = obj;
        sum += value;
    })
    data[key].values = filtered;

    const response = {
        value: sum
    }
    res.send(JSON.stringify(response));
});

server.post('/metric/:key', (req, res) => {
    const key = req.params.key;
    if(!key){
        res.status(200).send('{}');
    }
    const now = new Date().getTime();

    if(!data[key] || !data[key].values){
        data[key] = {values: []}
    }
    data[key].values.push({value: req.body.value, time: now});
    console.log(data);
    res.status(200);
})


server.listen(port);
console.log(`listening on port ${port}`);

export default server;