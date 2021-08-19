import pinataSDK from '@pinata/sdk';

import {
    secret,
    key,
    names,
    olderThanMinutes,
    leaveMinimum
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
        if (undefined === pins.count) {
            process.exit("Failed to load pins. Try again.");
        }
        var count = pins.count;
        var loop = 1;
        while (count > 0) {
            count -= PERPAGE
            await sleep(300);
            var newpins = await getPins(fname, loop * PERPAGE).catch(e => {
                console.log(e)
            });
            if (undefined !== pins.rows) {
                pins.rows = pins.rows.concat(newpins.rows);
                console.log(`Currently at ${pins.rows.length} to unpin`);
                loop++;
            }
        }
        console.log(`Processing a total of ${pins.rows.length}`);
        let pinCount = 0;
        for (var pin of pins.rows) {
            await pinata.unpin(pin.ipfs_pin_hash).catch(e => {
                console.log(e)
            });;
            if (!(pinCount % 50)) {
                const now = new Date();
                console.log(`${now.toTimeString()}: ${pinCount} of ${pins.rows.length} done`)
            }
            pinCount++;
            if (leaveMinimum > 0 && leaveMinimum >= pins.rows.length - pinCount) {
                break;
            }
        }
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
        "pinEnd": pinEnd.toISOString()
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};

process();