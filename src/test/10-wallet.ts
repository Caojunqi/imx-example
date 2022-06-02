import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
    ERC721TokenCodec,
    ERC721TokenType,
    ImmutableXClient,
    ImmutableXWallet,
    valueOrThrow,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-WITHDRAWAL-BALANCE]';

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

    const signer = new Wallet(privateKey).connect(provider);
    const wallet = new ImmutableXWallet({
        publicApiUrl: env.client.publicApiUrl,
        signer,
    });
    const client = await ImmutableXClient.build({
        ...env.client,
        signer,
    });

    const authenticationHeaders = await wallet.getAuthenticationHeaders();

    console.log(
        ` ${authenticationHeaders['imx-signature']} 
          ${authenticationHeaders['imx-timestamp']}`,
    );
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
