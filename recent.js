import pinataSDK from '@pinata/sdk';

import {
    secret,
    key,
    names,
    olderThanMinutes
} from './config.js';

const PERPAGE = 1000;

const now = new Date();
const pinEnd = new Date(now);
pinEnd.setMinutes(now.getMinutes() - olderThanMinutes);

console.log("Now in ISO:" + now.toISOString());

const pinata = pinataSDK(key, secret);

async function process() {
    for (var fname of names) {
        var pins = await getPins(fname, 0).catch(e => {
            console.log(e)
        });
        console.log(pins);
    }
}

async function getPins(name, offset) {
    console.log(`Looking for ${name} at offset ${offset}`);
    return pinata.pinList({
        "status": "pinned",
        "pageLimit": PERPAGE,
        "metadata": {
            "name": name
        },
        "pageOffset": offset,
        //"pinEnd": pinEnd.toISOString()
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};

process();