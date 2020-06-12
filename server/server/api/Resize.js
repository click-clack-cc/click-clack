const sharp = require('sharp');
const path = require('path');
const fs = require('fs')

class Resize {
    constructor(folder) {
        this.folder = folder;
    }

    async save(id, buffer) {
        const filename = id
        const filepath = this.filepath(id);

        await sharp(buffer)
            .resize(1920, 1080, {
                fit: 'cover',
                withoutEnlargement: false
            })
            .toFile(filepath);
        // fs.unlinkSync(filepath)
        return filename;
    }

    static filename() {
        return `${id}`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}

class ProfilePicResize {
    constructor(folder) {
        this.folder = folder;
    }

    async save(id, buffer) {
        const filename = id
        const filepath = this.filepath(id);

        await sharp(buffer)
            .resize(500, 500, {
                fit: 'cover',
                withoutEnlargement: false
            })
            .toFile(filepath);
        // fs.unlinkSync(filepath)
        return filename;
    }

    static filename() {
        return `${id}`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}

module.exports = {
    Resize,
    ProfilePicResize
};