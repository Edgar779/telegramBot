import pkg from 'express';
const { Router, Response } = pkg;
import Services from './service.js';


class ProcessRoutes {
   router = Router();

  constructor() {
    this.routes();
  }

   routes = () => {
    this.router.get('/startBot', this.startBot);
  }

  startBot = async (req, res) => {
    try {
      const response = await Services.startBot(req,res);
      res.send(response);
    } catch (e) {
        res.status(500).json({ message: 'Error processing the request' });
    }
  }
}

export default new ProcessRoutes().router;