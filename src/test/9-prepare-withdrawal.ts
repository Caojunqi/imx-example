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

    const quantity = BigNumber.from(1);
    const param: ImmutableMethodParams.ImmutablePrepareWithdrawalParamsTS = {
        user: signer.address,
        token,
        quantity,
    };

    const withdrawal_result = await client.prepareWithdrawal(param);

    console.log(
        `prepare withdrawal token, 
            ${withdrawal_result.withdrawal_id}
            ${withdrawal_result.status}
            ${withdrawal_result.time}`,
    );
    console.log(JSON.stringify(withdrawal_result, null, 2))
})().catch(e => {
    log.error(component, e);
    process.exit(1);
});
