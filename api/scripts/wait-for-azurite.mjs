// Waits for the storage emulator to accept connections. Azurite binds its table
// service a little after the process starts, so a test run that begins straight
// away fails with ECONNREFUSED.
const url = process.env.AZURITE_TABLE_URL ?? "http://127.0.0.1:10002/devstoreaccount1?comp=list";
const deadline = Date.now() + Number(process.env.AZURITE_WAIT_MS ?? 30000);

while (Date.now() < deadline) {
  try {
    // Any HTTP response means the service is listening; the status does not matter.
    await fetch(url);
    console.log("Azurite is accepting connections.");
    process.exit(0);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
}
console.error(`Azurite did not start within the timeout at ${url}`);
process.exit(1);
