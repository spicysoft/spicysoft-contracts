import fs from "fs";
const { mdToPdf } = require("md-to-pdf");
import recursive from "recursive-readdir";
import { ulid } from "ulid";

(async () => {
  const files = await recursive("./src/");
  await Promise.all(
    files.map(async (file) => {
      const tmpSrc = `./.temp/${ulid()}.md`;
      try {
        const dst = pathSrcToDst(file);
        if (fs.existsSync(dst)) {
          console.log(`Removing ${file}`);
          await fs.promises.rm(dst);
        }
        console.log(`Copying ${file} to ${tmpSrc}`);
        await fs.promises.cp(file, tmpSrc);
        console.log(`Converting ${tmpSrc} to PDF`);
        const pdf = await mdToPdf({ path: tmpSrc });
        console.log(`Writing PDF to ${dst}`);
        await fs.promises.writeFile(dst, pdf.content);
        console.log(`Removing ${tmpSrc}`);
        await fs.promises.rm(tmpSrc);
        console.log(`Done ${file}`);
      } catch (error) {
        console.error(file);
        console.error(error);
      }
    })
  );
})();

function pathSrcToDst(src: string): string {
  if (!src.startsWith("src")) {
    throw new Error(`Unexpected path structure src:'${src}'`);
  }
  if (!src.endsWith(".md")) {
    throw new Error(`Unexpected path structure src:'${src}'`);
  }
  return src.replace(/^src/, "dist").replace(/.md$/, ".pdf");
}
