import db from "../connection.js";
import { seed } from "./seed.js";
import * as testData from "../data/test-data/index.js"

const runSeed = () => {
    return seed(testData)
    .then(() => {
        db.end()
    });
}

runSeed();