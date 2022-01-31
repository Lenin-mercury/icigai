import { domdata } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getData();
        case 'POST':
            return createData();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getData() {
        const domelem = domdata.getAll();
        return res.status(200).json(domelem);
    }
    
    function createData() {
        try {
            domdata.create(req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }
}
