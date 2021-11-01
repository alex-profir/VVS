import { Request, response, Response } from "express";
import request from "supertest";
import NotFoundMiddleware from "../middlewares/404.middleware";
import { add } from "../utils";
import app from "../server"
import fs from "fs";

const notFoundHtml = fs.readFileSync("./views/404.ejs", { encoding: "utf8" })

describe("Basic functionality", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};
    beforeEach(() => {
        mockRequest = {
        };
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation((result) => {
                responseObject = result;
            }),
            status: jest.fn().mockImplementation((status) => {
                mockResponse.statusCode = status;
            }),
            format: jest.fn().mockImplementation((p) => {
                return p.json();
            }),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
            }),
        };
    });

    test("Knows how to add", () => {
        const numbers = [1, 2, 3, 4, 5];
        const result = add(...numbers);
        expect(result).toBe(15);
        const result2 = add(2, 3);
        expect(result2).toBe(5);
    });
    test("Not found page working", () => {
        const expectedStatusCode = 404;
        const expectedReponse = { error: 'Not found' };
        NotFoundMiddleware(mockRequest as any, mockResponse as any);

        console.log({ responseObject });

        expect(responseObject).toEqual(expectedReponse)
        expect(mockResponse.statusCode).toEqual(expectedStatusCode)

    })
    test("Not found page with supertest", () => {
        return request(app)
            .get("/something-unexpected")
            .expect(404)
            .then(data => {
                const text = data.text;
                expect(text).toBe(notFoundHtml);
            })

        // const response = await request(app).get("/something-unexpected")
        // console.log(response)
    })
})