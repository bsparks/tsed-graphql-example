import { registerProvider } from '@tsed/di';
import * as rTracer from 'cls-rtracer';
import { IConfig } from 'config';
import { LogEvent, Logger } from 'ts-log-debug';
import { CONFIG } from './config.provider';

interface LogConfig {
    logLevel: string;
    maxLogSize: number;
    maxFiles: number;
    fileLogLevel: string[];
    consoleLogLevel: string[];
    enableConsoleLogs: boolean;
}

export const LOGGER = Symbol.for('LOGGER');

const loggerFactory = (config: IConfig) =>
    new LogInitializer(config).getLogger();

registerProvider({
    provide: LOGGER,
    deps: [CONFIG],
    useFactory: loggerFactory,
});

class LogInitializer {
    private readonly logger = new Logger();

    private readonly layoutPattern = {
        type: 'pattern',
        pattern: '[%p][%d{yyyy-MM-dd hh:mm:ss}][%h] [%x{reqId}] - %x{msg}',
        tokens: {
            reqId: () => rTracer.id() || '-',
            msg: ({ data }: LogEvent) =>
                `${data[0]} ${data.length > 1 ? JSON.stringify(data[1]) : ''}`,
        },
    };

    constructor(config: IConfig) {
        const logConfig = config.get<LogConfig>('logConfig');
        this.logger.appenders.set(
            'file',
            this.fileAppender(logConfig, config.util.getEnv('NODE_ENV')),
        );
        if (logConfig.enableConsoleLogs) {
            this.logger.appenders.set(
                'console',
                this.consoleAppender(logConfig),
            );
        }
    }

    public getLogger(): Logger {
        return this.logger;
    }

    private readonly fileAppender = (logConfig: LogConfig, env: string) => ({
        type: 'file',
        pattern: 'yyyy-MM-dd',
        keepFileExt: true,
        maxSize: logConfig.maxLogSize,
        backups: logConfig.maxFiles,
        levels: logConfig.fileLogLevel,
        filename: `./logs/app-${env}.log`,
        layout: this.layoutPattern,
    });

    private readonly consoleAppender = (logConfig: LogConfig) => ({
        type: 'console',
        layout: this.layoutPattern,
        levels: logConfig.consoleLogLevel,
    });
}
