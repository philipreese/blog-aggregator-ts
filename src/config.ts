import fs from "fs";
import os from "os";

type Config = {
    dbUrl: string;
    currentUserName?: string;
}    
export function readConfig() {
    const fileName = getConfigFilePath();
    try {
        return validateConfig(JSON.parse(fs.readFileSync(fileName, "utf-8")));
    } catch (err) {
        throw err;
    }           
}

export function setUser(userName: string) {
    const config = readConfig();
    config.currentUserName = userName
    writeConfig(config);
}

function getConfigFilePath() {
    return `${os.homedir()}/.gatorconfig.json`;
}

function validateConfig(rawConfig: any) {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
      throw new Error("db_url is required in config file");
    }
    if (
      !rawConfig.current_user_name ||
      typeof rawConfig.current_user_name !== "string"
    ) {
      throw new Error("current_user_name is required in config file");
    }
  
    const config: Config = {
      dbUrl: rawConfig.db_url,
      currentUserName: rawConfig.current_user_name,
    };
  
    return config;
  }

  function writeConfig(config: Config) {
    const configJson = { db_url: config.dbUrl, current_user_name: config.currentUserName };
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(configJson));
  }