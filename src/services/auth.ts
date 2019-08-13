import { Inject, Service } from '@tsed/di';
import { IConfig } from 'config';
import { CONFIG } from '../config.provider';
import { User, UserAccount } from '../types/user';

@Service()
export class AuthService {
    @Inject(CONFIG)
    private readonly config: IConfig;

    public async login(username: string, pass: string): Promise<UserAccount> {
        const users: User[] = this.config.get('users');
        const user = users.find(u => u.user === username && u.pass === pass);

        if (!user) {
            throw new Error('Invalid username or password');
        }

        return user.account;
    }
}
