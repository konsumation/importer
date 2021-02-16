#!/usr/bin/env node
import { createReadStream } from "fs";
import csv from "csv-parser";

/*
import levelup from "levelup";
import leveldown from "leveldown";
import { Master, VALUE_PREFIX, secondsAsString } from "konsum-db";
*/
/**
 */
async function execute(
  csvFile = "tests/fixtures/sunnyBoy-201703.csv",
  dbFile = "db",
  categoryName = "sunny"
) {
  const parser = csv({
    separator: ";",
    skipLines: 9,
    headers: ["date", "total", "increment"]
  });
  createReadStream(csvFile, { encoding: "utf8" }).pipe(parser);

  for await (const record of parser) {
    console.log(record);
  }

  /*
  const master = await Master.initialize(await levelup(leveldown(dbFile)));
      let nKey = m[1] + secondsAsString(Math.round(parseFloat(m[2])));

      await master.db.put(nKey, data.value);
*/
}

execute();
