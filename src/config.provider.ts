import { registerProvider } from '@tsed/di';
import * as config from 'config';

export const CONFIG = Symbol.for('CONFIG');

registerProvider({ provide: CONFIG, useValue: config });
