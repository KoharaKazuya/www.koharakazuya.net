import { createGenerator } from "./core/generate";
import { createPageGenerator } from "./core/page";
import { createFileSystemAdaptor } from "./fs";
import { createTemplate } from "./template";

async function main() {
  const fs = createFileSystemAdaptor({});
  const template = createTemplate({});
  const pageGenerator = createPageGenerator({ template });
  const generate = createGenerator({ fs, pageGenerator });

  await generate();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
