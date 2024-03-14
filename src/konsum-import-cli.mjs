#!/usr/bin/env node
import { createReadStream } from "node:fs";
import csv from "csv-parser";
import levelup from "levelup";
import leveldown from "leveldown";
import { Master, Category } from "@konsumation/db-level";

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

  const master = await Master.initialize(await levelup(leveldown(dbFile)));

  const category = new Category(categoryName, master, { unit: "kWh" });
  await category.write(master.db);

  //const category = await master.category(categoryName);
  //console.log(category);

  for await (const record of parser) {
    const [day, month, year] = record.date.split(/\//);
    const date = Math.round(new Date().getTime(year, month, day) / 1000);

    console.log(date, parseFloat(record.total.replace(/,/, ".")));

    await category.writeValue(
      master.db,
      parseFloat(record.total.replace(/,/, ".")),
      date
    );
  }

  await master.backup(process.stdout);

  await master.close();
}

execute();
