import pinataSDK from '@pinata/sdk';

import {
    secret,
    key,
    names
} from './config.js';

const PERPAGE = 1000;

const now = new Date();
console.log("Now in ISO:" + now.toISOString());

const pinata = pinataSDK(key, secret);

async function process() {
    for (var fname of names) {
        var pins = await getPins(fname).catch(e => {
            console.log(e)
        });
        console.log(pins);
    }
}

async function getPins(name) {
    console.log(`Looking for latest ${PERPAGE} of ${name}.`);
    return pinata.pinList({
        "status": "pinned",
        "pageLimit": PERPAGE,
        "metadata": {
            "name": name
        }
    });
}

process();