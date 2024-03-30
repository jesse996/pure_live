import { createPagesFunctionHandler } from '@remix-run/node-pages'

import * as build from '../build/server'

export const onRequest = createPagesFunctionHandler({ build })
