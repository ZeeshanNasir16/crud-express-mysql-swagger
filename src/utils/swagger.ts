import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Docs in JSON format
  // app.get('/api-docs.json', (req: Request, res: Response) => {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(swaggerDocument);
  // });

  console.log(`Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
