#!/usr/bin/env node
import { createReadStream } from "fs";
import levelup from "levelup";
import leveldown from "leveldown";
import { Master, VALUE_PREFIX, secondsAsString } from "konsum-db";

/**
 */
async function execute(csvFile="sunnyBoy-201703.csv",dbFile="db") {

  const stream = createReadStream(csvFile,{encoding:"utf8"});

  for(const chunk of stream) {
    console.log(chunk);
  }

/*
  const master = await Master.initialize(await levelup(leveldown(dbFile)));
      let nKey = m[1] + secondsAsString(Math.round(parseFloat(m[2])));

      await master.db.put(nKey, data.value);
*/
}

execute();
