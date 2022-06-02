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
    ImmutableMethodParams,
} from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { NonceManager } from '@ethersproject/experimental'

import env from '../config/client';
import { loggerConfig } from '../config/logging';
import { BigNumber } from '@ethersproject/bignumber';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-BURN-NFT]';

(async (): Promise<void> => {
    const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

    const signer = new Wallet(privateKey).connect(provider);
    const client = await ImmutableXClient.build({
        ...env.client,
        signer,
    });

    const token = valueOrThrow(
        ERC721TokenCodec.decode({
            type: ERC721TokenType.ERC721,
            data: {
                tokenId: env.tokenId,
                tokenAddress: env.tokenAddress,
            },
        }),
    );

    const quantity = BigNumber.from(1);
    const param: ImmutableMethodParams.ImmutableBurnParamsTS = {
        sender: signer.address,
        token,
        quantity,
    };

    const burn_result = await client.burn(param);
    console.log(JSON.stringify(burn_result, null, 2))
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
