import puppeteer from "puppeteer";

jest.setTimeout(100000);

function sleep(ms: number) {
    return new Promise((res, rej) => setTimeout(res));
}

describe("Login Functionality", () => {
    let browser: puppeteer.Browser = null!;
    let page: puppeteer.Page = null!;

    // const endpointUrl = "https://application-0-okqxo.mongodbstitch.com"
    const endpointUrl = "http://localhost:8080"

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                // "--disable-web-security",
                // "--no-sandbox",
                // "--disable-setuid-sandbox",
            ],
            slowMo: 150,
            ignoreDefaultArgs: ["--disable-extensions"],
            ignoreHTTPSErrors: true,
        });

        page = await browser.newPage();
        await page.goto(`${endpointUrl}`);

    }, 100000);

    afterEach(async () => {
        await browser.close();
    });

    test("Login Error", async () => {

        await page.type("#email", "alex_profir@yahoo.com");
        await page.type("#password", "1234567");


        // has error message
        const el = await page.$x("//form/div[contains(., 'Invalid username or password') and contains(@class, 'MuiBox-root')]")
        expect(el).toBeTruthy();

        await browser.close();

        // .MuiButtonBase-root

        // const [button] = await page.$x("//button[contains(., 'SIGN IN')]");
        // if (button) {
        //     await button.click();
        // }
    });
    test("Login successfully", async () => {
        // good password
        await page.type("#email", "alex_profir@yahoo.com");
        await page.type("#password", "12345678");

        await page.click(".MuiButton-root");

        await page.waitForNavigation();

        await browser.close();
    });

    test("Spin the wheel and get prize", async () => {

        await page.type("#email", "alex_profir@yahoo.com");
        await page.type("#password", "12345678");

        await page.click(".MuiButton-root");

        await page.waitForNavigation();
        // 
        await page.click(".MuiButtonBase-root");

        await page.waitForSelector(".MuiTypography-root");

        await browser.close();
    });

})