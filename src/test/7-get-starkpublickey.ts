import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);
const component = 'imx-user-check-script';

(async (): Promise<void> => {
    const minter = await ImmutableXClient.build({
        ...env.client,
        signer: new Wallet(env.privateKey1).connect(provider),
    });

    console.log(minter.starkPublicKey);
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
