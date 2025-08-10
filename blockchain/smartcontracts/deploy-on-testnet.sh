#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo ".env file not found!"
    exit 1
fi

if [ -z "$MORPH_PRIVATE_KEY" ] || [ -z "$MORPH_RPC_URL" ] || [ -z "$CHAIN_ID" ]; then
    echo "Error: Environment variables not defined. Please check the .env file"
    exit 1
fi

echo "Deploying to Morph Holesky Testnet..."
echo "RPC URL: $MORPH_RPC_URL"
echo "Chain ID: $CHAIN_ID"

forge script script/Deploy.s.sol:DeployScript \
    --private-key $MORPH_PRIVATE_KEY \
    --rpc-url $MORPH_RPC_URL \
    --chain-id $CHAIN_ID \
    --broadcast \
    --verify
