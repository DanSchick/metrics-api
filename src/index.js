import express from 'express';

const server = express();
server.use(express.json());

const port = process.env.PORT || 3000;
const data = {}

export const isOverAnHourAgo = (timestamp) => {
    const now = new Date().getTime();
    const hour = 1000 * 60 * 60;
    if (now - timestamp > hour) {
        return true;
    }
    return false;
}


server.get('/metric/:key/sum', (req, res) => {
    const key = req.params.key;
    if (!data[key] || !data[key].values) {
        res.status(400).send('{}');
        return;
    }
    const values = data[key].values;
    const filtered = values.filter(v => !isOverAnHourAgo(v.time));

    let sum = 0;
    filtered.forEach(obj => {
        const { value } = obj;
        if (value) {
            sum += value;
        }

    })
    data[key].values = filtered;

    const response = {
        value: sum
    }
    res.send(JSON.stringify(response));
    return;
});

server.post('/metric/:key', (req, res) => {
    const key = req.params.key;
    if (!key) {
        res.status(400).send('Missing key');
        return;
    }
    const now = new Date().getTime();

    if (!data[key] || !data[key].values) {
        data[key] = { values: [] }
    }
    data[key].values.push({ value: req.body.value, time: now });
    console.log(data);
    res.send('{}');
})


server.listen(port);
console.log(`listening on port ${port}`);

export default server;