#!/usr/bin/env -S node --title konsum-importer
import { createReadStream } from "node:fs";
import csv from "csv-parser";
import { Master as LevelMaster } from "@konsumation/db-level";
import { Master as PostgresMaster } from "@konsumation/db-level";


/**
 */
async function execute(
  master,
  csvFile = "tests/fixtures/sunnyBoy-201703.csv",
  categoryName = "sunny"
) {
  const parser = csv({
    separator: ";",
    skipLines: 9,
    headers: ["date", "total", "increment"]
  });
  createReadStream(csvFile, { encoding: "utf8" }).pipe(parser);


  const category = master.addCategory({ name: categoryName, unit: "kWh" });
  await category.write(master.context);

  //const category = await master.category(categoryName);
  //console.log(category);

  for await (const record of parser) {
    const [day, month, year] = record.date.split(/\//);
    const date = Math.round(new Date().getTime(year, month, day) / 1000);

    console.log(date, parseFloat(record.total.replace(/,/, ".")));

    await category.writeValue(
      master.context,
      date,
      parseFloat(record.total.replace(/,/, "."))
    );
  }

  await master.close();
}

const dbTypes = {
  'postgresql' : PostgresMaster,
  'level' : LevelMaster
};

const dbType = 'level';
const dbParam = "db";
const master = await dbTypes[dbType].initialize(dbParam);

execute(master);
