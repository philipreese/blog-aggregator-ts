import { readConfig, setUser } from "./config";

function main() {
    setUser("Philip");
    console.log(readConfig());
}

main();