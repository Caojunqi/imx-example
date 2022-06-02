import { AlchemyProvider,InfuraProvider } from '@ethersproject/providers';
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

const component = '[IMX-WITHDRAWAL-BALANCE]';

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

    const starkPublicKey = client.starkPublicKey;
    const address = client.address;
    console.log(`starkPublicKey: ${starkPublicKey}\n address:${address}`)
    const param: ImmutableMethodParams.ImmutableCompleteWithdrawalParamsTS = {
        starkPublicKey,
        token,
    };

    console.log(JSON.stringify(param, null, 2))

    const withdrawal_result = await client.completeWithdrawal(param);

    console.log(
        `complete withdrawal token: ${withdrawal_result}`
    );
    console.log(JSON.stringify(withdrawal_result, null, 2))
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
