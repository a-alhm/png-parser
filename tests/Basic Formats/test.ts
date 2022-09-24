import fs from "fs"
import path from "path"

import { expect } from 'chai';
import parsePng from '../../index'

let dependencies = [
    "./images/basn0g01",
];


describe('Basic Formats', () => {
    it('black & white', () => {
        const buffer = fs.readFileSync(path.join(__dirname, "images", 'basn0g01.png'), null).buffer
        const png = parsePng(buffer);
        console.log(png)
    });
    it('grayscale', () => {

    });
    it('rgb color', () => {

    });
    it('paletted', () => {

    });
    it('grayscale alpha-channel', () => {

    });
    it('rgb color alpha-channel', () => {

    });
});