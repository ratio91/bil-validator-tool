import fs from 'fs';
import path from 'path';

/**
 * Deletes all files that meet the provided criteria (path, extension, age).
 */
function removeFilesSync(dirPath: string, fileExtension: string, maxAgeSec: number) {
  const timeNow = new Date().getTime();
  const timeDif = maxAgeSec * 1000;
  try {
    const filesInDir = fs.readdirSync(dirPath);
    filesInDir.forEach((file) => {
      const currentFile = path.join(dirPath, file);
      try {
        const stats = fs.statSync(currentFile);
        if (!stats.isDirectory()) {
          const currentExt = path.extname(currentFile);
          if (currentExt === fileExtension) {
            if (stats.mtime.getTime() + timeDif < timeNow) {
              fs.unlinkSync(currentFile);
            }
          }
        }
      } catch (exc) {
        // cannot read filestats -> ignore
      }
    });
  } catch (err) {
    // cannot read directory --> return
  }
}

export default removeFilesSync;
