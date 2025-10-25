import { Module } from '@nestjs/common';
import { LogViewerController } from './log-viewer.controller';
import { FileLoggerModule } from '../file-logger/file-logger.module';

@Module({
  imports: [FileLoggerModule],
  controllers: [LogViewerController],
})
export class LogViewerModule {}
