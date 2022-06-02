import env from '../config/client';
import { Wallet } from '@ethersproject/wallet';
import { requireEnvironmentVariable } from 'libs/utils';
import { AlchemyProvider,InfuraProvider } from '@ethersproject/providers';
const provider = new AlchemyProvider(env.ethNetwork,env.alchemyApiKey);
const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

const signer = new Wallet(privateKey).connect(provider);
console.log('cccc')