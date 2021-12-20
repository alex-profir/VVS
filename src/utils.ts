import fs from "fs";
export function add(...numbers: number[]) {
    return numbers.reduce((acc, x) => acc + x, 0);
}

const imageRegex = /.*\.(gif|jpe?g|bmp|png)$/igm;
export function getFilesFromFileName(fileName: string) {
    const files = fs.readdirSync(fileName, { encoding: "utf8", withFileTypes: true });


    return files.map(f => ({
        name: f.name,
        isDir: f.isDirectory(),
        isFile: f.isFile(),
        isImage: imageRegex.test(f.name)
    }));

}