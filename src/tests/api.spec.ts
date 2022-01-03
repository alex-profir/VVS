import { Request, response, Response } from "express";
import request from "supertest";
import NotFoundMiddleware from "../middlewares/404.middleware";
import { add, getFilesFromFileName } from "../utils";
import app from "../server"
import fs from "fs";
import ejs from "ejs";

const notFoundHtml = fs.readFileSync("./views/404.ejs", { encoding: "utf8" })
const welcomePage = fs.readFileSync("./views/Welcome.ejs", { encoding: "utf8" });

describe("Basic functionality", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response> & {
        default: any
    };
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
            default: jest.fn().mockImplementation((result) => {
                responseObject = result;
            })
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
    });
    test("Full maintanance functionality", async () => {
        const maintananceModeTrue = {
            maintananceMode: true
        }
        const maintananceModeFalse = {
            maintananceMode: false
        }
        const req1 = request(app)
            .get("/maintanance")
            .expect(200)
        await req1;
        const req2 = request(app)
            .get("/maintanance-state")
            .expect(200)
        const result = await req2;
        expect(JSON.parse(result.text)).toEqual(maintananceModeTrue);


        const resourceRequest = request(app)
            .get("/welcome")
            .expect(503);
        const message = await resourceRequest;
        expect(message.text).toBe("Maintanance"); // we are in 
        // maintanance mode , so this should be the a string

        await request(app)
            .get("/maintanance")
            .expect(200);

        const req3 = request(app)
            .get("/maintanance-state")
            .expect(200);

        const newData = await req3;
        expect(JSON.parse(newData.text)).toEqual(maintananceModeFalse);
    });

    test("Welcome page", async () => {
        const req = await request(app).get("/welcome").expect(200)
        const files = getFilesFromFileName("build");
        const output = ejs.render(welcomePage, {
            data: files,
            relPath: "/"
        });
        expect(req.text).toBe(output);
        // console.log(req.text)
    });

    test("Check correct content", async () => {
        const path = "/static/";
        const req = await request(app).get(path).expect(200)
        const files = getFilesFromFileName(`build${path}`);
        const output = ejs.render(welcomePage, {
            data: files,
            relPath: path
        });
        expect(req.text).toBe(output);
    })
})