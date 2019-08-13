import { Inject } from '@tsed/di';
import { DataSourceService } from '@tsed/graphql';
import { RESTDataSource } from 'apollo-datasource-rest';
import { IConfig } from 'config';
import * as DataLoader from 'dataloader';
import { CONFIG } from '../../config.provider';
import { UserInfo } from '../../types/user';

@DataSourceService()
export class UsersDataSource extends RESTDataSource {
    private readonly loader: DataLoader<number, UserInfo>;

    constructor(@Inject(CONFIG) config: IConfig) {
        super();

        this.baseURL = config.get('restService');

        this.loader = new DataLoader<number, UserInfo>(async (ids) => {
            const users = await this.bulkLoadUsers(ids);
            return users;
        });
    }

    public async getUserById(userId: number): Promise<UserInfo> {
        return this.get(`/users/${userId}`);
    }

    public async loadUser(userId: number): Promise<UserInfo> {
        return this.loader.load(userId);
    }

    protected willSendRequest(req): void {
        this.context.logger.info('user datasource send request');
    }

    private async bulkLoadUsers(userIds: number[]): Promise<UserInfo[]> {
        this.context.logger.info('bulkLoadUsers: ', userIds.length);
        const allUsers = await this.get<UserInfo[]>('/users');
        return allUsers.filter(u => userIds.includes(u.id));
    }
}
