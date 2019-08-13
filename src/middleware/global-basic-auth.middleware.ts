import { IMiddleware, Inject, Middleware, Req } from '@tsed/common';
import { IConfig } from 'config';
import { BadRequest } from 'ts-httpexceptions';
import { Logger } from 'ts-log-debug';
import { CONFIG } from '../config.provider';
import { LOGGER } from '../logger';
import { AuthService } from '../services/auth';
import { UserAccount } from '../types/user';

@Middleware()
export class GlobalBasicAuthMiddleware implements IMiddleware {
    constructor(
        @Inject(CONFIG) private readonly config: IConfig,
        @Inject(LOGGER) private readonly logger: Logger,
        private readonly authService: AuthService,
    ) {}

    public async use(
        @Req()
        request: Req & {
            user?: UserAccount;
            isAuthenticated?(): boolean;
        },
    ): Promise<void> {
        // support @Authenticated
        if (!request.isAuthenticated) {
            request.isAuthenticated = () => false;
        }

        if (request.headers.authorization) {
            const [tokenType, token] = request.headers.authorization.split(' ');
            if (tokenType && tokenType.toLowerCase() === 'basic') {
                this.logger.info('got basic auth header');
                if (!token) {
                    throw new BadRequest('missing credentials');
                }
                const [user, pass] = new Buffer(token, 'base64')
                    .toString()
                    .split(':');
                const authorizedUser = await this.authService.login(user, pass);
                request.isAuthenticated = () => true;
                request.user = authorizedUser;
            }
        }
    }
}
