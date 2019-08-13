import { ServerLoader, ServerSettings } from '@tsed/common';
import { Env } from '@tsed/core';
import { AuthenticationError } from 'apollo-server-express';
import * as rTracer from 'cls-rtracer';
import * as config from 'config';
import { Logger } from 'ts-log-debug';
import { LOGGER } from './logger';
import { GlobalBasicAuthMiddleware } from './middleware/global-basic-auth.middleware';

const rootDir = process.cwd();

@ServerSettings({
    graphql: {
        server1: {
            path: '/graphql',
            buildSchemaOptions: {
                emitSchemaFile: true,
                authChecker: ({ root, args, context }, roles) => {
                    const { user, logger, isAuthenticated } = context;
                    logger.info('Auth Checker: ', {
                        root,
                        args,
                        context,
                        roles,
                    });

                    if (!isAuthenticated()) {
                        throw new AuthenticationError('Not authenticated.');
                    }

                    if (roles && roles.length) {
                        const authorized = roles.some(role =>
                            user.roles.includes(role),
                        );
                        if (!authorized) {
                            return false;
                        }
                    }

                    return true;
                },
            },
            serverConfig: {
                context: ({ req }) => ({
                    user: req.user,
                    isAuthenticated: req.isAuthenticated,
                    logger: req.logger,
                }),
            },
        },
    },
    componentsScan: [
        `${rootDir}/src/schema/**/*.ts`,
        `${rootDir}/src/services/**/*.ts`,
        `${rootDir}/src/middleware/**/*.ts`,
    ],
    httpPort: config.get('port'),
    httpsPort: false,
    env: config.get('production') ? Env.PROD : Env.DEV,
})
export class Server extends ServerLoader {
    public $onInit(): void {
        this.use(rTracer.expressMiddleware());
        // due to express timing middleware for graphql needs to be added here before the
        // $onMountingMiddlewares hook
        this.use('/graphql', async (req, res, next) => {
            const logger: Logger = this.injector.get<Logger>(LOGGER);

            req.logger = logger;

            const basicAuthMW = this.injector.get<GlobalBasicAuthMiddleware>(
                GlobalBasicAuthMiddleware,
            );
            await basicAuthMW.use(req);
            next();
        });
    }

    // doing this one to support any controllers other than gql
    public $onMountingMiddlewares(): void {
        this.use(GlobalBasicAuthMiddleware);
    }
}
