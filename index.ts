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
          await fs.promises.rm(dst);
        }
        await fs.promises.cp(file, tmpSrc);
        const pdf = await mdToPdf({ path: tmpSrc });
        await fs.promises.writeFile(dst, pdf.content);
        await fs.promises.rm(tmpSrc);
      } catch (error) {
        console.log(file);
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
