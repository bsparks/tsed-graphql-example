// tslint:disable-next-line:no-default-export
export default {
    serviceName: 'example-service-development',
    port: 3000,
    production: false,
    logConfig: {
        maxFiles: 10, // max number of old files to keep
        maxLogSize: 1000000, // max logSize in bytes
        fileLogLevel: ['debug', 'info', 'error', 'warn'],
        consoleLogLevel: ['debug', 'info', 'error', 'warn'],
        enableConsoleLogs: true,
    },
    restService: 'https://jsonplaceholder.typicode.com',
    // not for production
    users: [
        {
            user: 'admin',
            pass: 'testing123$',
            account: {
                id: 'admin1',
                username: 'admin',
                roles: ['Admin', 'User', 'Moderator'],
            },
        },
        {
            user: 'user1',
            pass: 'testing$321',
            account: {
                id: 'user1',
                username: 'user1',
                roles: ['User'],
            },
        },
        {
            user: 'moderator1',
            pass: 'testing$999',
            account: {
                id: 'user2',
                username: 'moderator1',
                roles: ['User', 'Moderator'],
            },
        },
    ],
};
