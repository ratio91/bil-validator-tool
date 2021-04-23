import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import removeFilesSync from './utils/removeFilesSync';

/** The FileLogger class extends the nestJS default logger and adds the functionality to write log outputs into a logfile. */
export class FileLogger extends Logger {
  private readonly logPath = process.env.LOGDIR_PATH || 'logs/';

  private readonly logExtension = '.log';

  private readonly maxAgeSeconds = 3600 * 24 * 7; // 7 days

  constructor(context?: string, isTimestampEnabled?: boolean) {
    super(context, isTimestampEnabled);

    if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath, { recursive: true });

    removeFilesSync(this.logPath, this.logExtension, this.maxAgeSeconds);

    this.logToFile(`Init new logger session`);
  }

  static date() {
    return new Date().toISOString().slice(0, 10); // just get date from iso string - eg 2012-11-04
  }

  static timestamp() {
    return new Date().toISOString();
  }

  logToFile(message: string) {
    const fileName = path.join(this.logPath, FileLogger.date() + this.logExtension);
    fs.appendFileSync(fileName, `${FileLogger.timestamp()} ${message}\n`);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.logToFile(`ERROR [${context}] ${message}`);
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.logToFile(`LOG [${context}] ${message}`);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.logToFile(`WARN [${context}] ${message}`);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.logToFile(`DEBUG [${context}] ${message}`);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.logToFile(`VERBOSE [${context}] ${message}`);
  }
}
