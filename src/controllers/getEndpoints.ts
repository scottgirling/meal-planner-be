import { Response, Request } from "express";
import endpoints from "../endpoints.json";
    
export const getEndpoints = (request: Request, response: Response) => {
    response.status(200).send({ endpoints });
}