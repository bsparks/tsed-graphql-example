import { $log } from 'ts-log-debug';
import { Server } from './server';

new Server().start().catch((err) => {
    $log.error(err);
});
