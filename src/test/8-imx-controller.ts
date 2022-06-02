import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
    ERC721TokenCodec,
    ERC721TokenType,
    ImmutableXClient,
    ImmutableXWallet,
    ImmutableXController,
    valueOrThrow,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { NonceManager } from '@ethersproject/experimental'

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-WITHDRAWAL-BALANCE]';

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

    const signer = new NonceManager(new Wallet(privateKey).connect(provider));
    const controller = new ImmutableXController(
        env.client.publicApiUrl,
        signer,
    );

    const address = await controller.getAddress();
    const starkPublicKey = await controller.starkPublicKey;

    console.log(
        `${address}
         ${starkPublicKey}`
    );
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
