#!/usr/bin/env -S node --title konsum-importer
import { createReadStream } from "node:fs";
import csv from "csv-parser";
import { LevelMaster } from "@konsumation/db-level";
import { PostgresMaster } from "@konsumation/db-postgresql";

/**
 */
async function execute(
  master,
  csvFile = "tests/fixtures/sunnyBoy-201703.csv",
  categoryName = "sunny"
) {
  const context = master.context;

  const parser = csv({
    separator: ";",
    skipLines: 9,
    headers: ["date", "total", "increment"]
  });
  createReadStream(csvFile, { encoding: "utf8" }).pipe(parser);

  const category = await master.addCategory({ name: categoryName, unit: "kWh" });
  await category.write(context);
  const meter = await category.addMeter({ name: categoryName });
  await meter.write(context);

  for await (const record of parser) {
    const [day, month, year] = record.date.split(/\//);

   // console.log(parseFloat(record.total.replace(/,/, ".")));

    await meter.writeValue(
      context,
      new Date(year, month, day),
      parseFloat(record.total.replace(/,/, "."))
    );
  }

  await master.close();
}

const dbTypes = Object.fromEntries(
  [PostgresMaster, LevelMaster].map(f => [f.name, f])
);

console.log(dbTypes);

const dbType = "level";
const dbParam = "db";
const master = await dbTypes[dbType].initialize(dbParam);

execute(master);
